// -----------------------------
// Utilities & Constants
// -----------------------------
const SURAH_SELECTOR = ".SurahPreviewRow_surahName__IHiSd";
const JUZ_CONTAINER_SEL = ".JuzView_juzContainer__L8HsL";          // parent container for a juz item
const JUZ_TITLE_SEL = ".JuzView_juzTitle__DjSou span:last-child"; // selector to extract juz number
const TAB_SELECTED_SEL = ".Tabs_tabItemSelected__YXy2p";

function getSurahKey(element) {
  return element.textContent.trim().toLowerCase();
}

function getCurrentView() {
  const active = document.querySelector(TAB_SELECTED_SEL);
  if (!active) return "surah";
  const v = active.textContent.trim().toLowerCase();
  if (v.includes("juz")) return "juz";
  if (v.includes("revelation")) return "revelation";
  return "surah";
}

function getJuzForElement(element) {
  const parent = element.closest(JUZ_CONTAINER_SEL);
  if (!parent) return "all";
  const txt = parent.querySelector(JUZ_TITLE_SEL)?.textContent;
  return txt ? txt.trim() : "all";
}

// -----------------------------
// Storage initialization helpers
// -----------------------------
function ensureStoresExist(cb) {
  chrome.storage.local.get({ memorizedJuz: {}, memorizedSurah: {} }, (res) => {
    // ensure objects exist
    const memorizedJuz = res.memorizedJuz || {};
    const memorizedSurah = res.memorizedSurah || {};
    // write back if they were missing (optional)
    chrome.storage.local.set({ memorizedJuz, memorizedSurah }, () => cb && cb(memorizedJuz, memorizedSurah));
  });
}

// -----------------------------
// Loading & Injection
// -----------------------------
function createCheckbox() {
  const c = document.createElement("input");
  c.type = "checkbox";
  c.style.marginLeft = "8px";
  c.style.width = "16px";
  c.style.height = "16px";
  return c;
}

function restoreStateAndAttach(element) {
  // element is the surah name node
  const key = getSurahKey(element);
  const view = getCurrentView();
  const juz = (view === "juz") ? getJuzForElement(element) : "all";

  // create checkbox
  const checkbox = createCheckbox();
  checkbox.dataset.surahKey = key;
  checkbox.dataset.juz = juz;
  checkbox.dataset.view = view;

  // load state then set checked
  chrome.storage.local.get({ memorizedJuz: {}, memorizedSurah: {} }, (res) => {
    const { memorizedJuz, memorizedSurah } = res;
    if (view === "juz") {
      if (memorizedJuz[key]?.[juz]) checkbox.checked = true;
    } else {
      if (memorizedSurah[key]) checkbox.checked = true;
    }
  });

  // save handler (delegates to saveState)
  checkbox.addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    const isChecked = checkbox.checked;
    // call save (reads current view/key/juz from dataset)
    saveState(checkbox.dataset.surahKey, checkbox.dataset.juz, checkbox.dataset.view, isChecked);
  });

  element.dataset.checkboxInjected = "true";
  element.appendChild(checkbox);
}

function injectCheckboxesForView() {
  const nodes = document.querySelectorAll(SURAH_SELECTOR);
  if (!nodes || nodes.length === 0) {
    // nothing yet — try later
    setTimeout(injectCheckboxesForView, 100);
    return;
  }
  nodes.forEach((el) => {
    if (el.dataset.checkboxInjected) return;
    restoreStateAndAttach(el);
  });
}

// -----------------------------
// Save / Sync logic
// -----------------------------
function saveState(surahKey, juz, view, isChecked) {
  // load both stores, update appropriately, then persist and call merge
  chrome.storage.local.get({ memorizedJuz: {}, memorizedSurah: {} }, (res) => {
    const memorizedJuz = res.memorizedJuz || {};
    const memorizedSurah = res.memorizedSurah || {};

    if (view === "juz") {
      if (!memorizedJuz[surahKey]) memorizedJuz[surahKey] = {};
      memorizedJuz[surahKey][juz] = isChecked;

      // recompute whether full surah is memorized (all juz parts true)
      const parts = Object.values(memorizedJuz[surahKey]);
      const fully = parts.length > 0 && parts.every(v => v === true);
      memorizedSurah[surahKey] = fully;
    } else {
      // Surah or Revelation view toggled -> treat as full-surah toggle
      memorizedSurah[surahKey] = isChecked;
      // optionally mark existing known juz parts to the same value
      if (!memorizedJuz[surahKey]) memorizedJuz[surahKey] = {};
      Object.keys(memorizedJuz[surahKey]).forEach(j => { memorizedJuz[surahKey][j] = isChecked; });
    }

    chrome.storage.local.set({ memorizedJuz, memorizedSurah }, () => {
      // after saving, update UI consistency across views
      mergeAndSyncUI(surahKey, memorizedJuz, memorizedSurah);
    });
  });
}

// -----------------------------
// Merge & Sync UI (separate function called after saves or on observer triggers)
// -----------------------------
function mergeAndSyncUI(changedSurahKey, memorizedJuz, memorizedSurah) {
  // Purpose: ensure UI across views reflects the two stores.
  // - If memorizedSurah[surahKey] === true => all checkboxes for that surah across page should be checked
  // - If memorizedSurah[surahKey] === false but memorizedJuz has some true => only the Juz instances checked
  // Implementation: find all injected checkboxes on page for this surahKey and set states accordingly.

  const allCheckboxes = document.querySelectorAll(`input[type="checkbox"][data-surah-key="${changedSurahKey}"]`);
  allCheckboxes.forEach(cb => {
    const cbView = cb.dataset.view || getCurrentView();
    const cbJuz = cb.dataset.juz || "all";

    if (cbView === "juz") {
      cb.checked = !!(memorizedJuz[changedSurahKey] && memorizedJuz[changedSurahKey][cbJuz]);
    } else {
      cb.checked = !!memorizedSurah[changedSurahKey];
    }
  });
}

// A convenience wrapper when you don't pass stores
function mergeAndSyncUI_wrapper(surahKey) {
  chrome.storage.local.get({ memorizedJuz: {}, memorizedSurah: {} }, (res) => {
    mergeAndSyncUI(surahKey, res.memorizedJuz, res.memorizedSurah);
  });
}

// -----------------------------
// Mutation observer & start
// -----------------------------
function setupObserverAndStart() {
  ensureStoresExist(() => {
    injectCheckboxesForView(); // initial injection

    const observer = new MutationObserver(() => {
      // on each mutation attempt to inject new checkboxes then optionally resync full-surah UI
      injectCheckboxesForView();
      // optionally iterate changed surahs and call mergeAndSyncUI_wrapper() if needed
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

// Start
setupObserverAndStart();
