// Injecting the checkboxes
function getSurahName(element) {
    return element.textContent.trim().toLowerCase();
}

function getCurrentView() {
  const activeTab = document.querySelector('.Tabs_tabItemSelected__YXy2p');
  if (!activeTab) return 'surah'; // fallback

  const viewName = activeTab.textContent.trim().toLowerCase();
  if (viewName.includes('juz')) return 'juz';
  if (viewName.includes('revelation')) return 'revelation';
  return 'surah';
}

function injectCheckboxes() {
    const surahElements = document.querySelectorAll(".SurahPreviewRow_surahName__IHiSd");
    if (surahElements.length === 0) {
        setTimeout(injectCheckboxes, 100); 
        return;
    }

    surahElements.forEach((element) => {
        if (element.dataset.checkboxInjected) return;

        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.style.marginLeft = "8px";
        newCheckbox.style.width = "16px";
        newCheckbox.style.height = "16px";

        const key = getSurahName(element); // canonical surah name
        newCheckbox.dataset.surahKey = key;

        // Determine the current view
        const currentView = getCurrentView();

        // Determine which Juz this checkbox belongs to
        let juz = "all"; // default for Surah/Revelation views
        if (currentView === "juz") {
            // Find the parent container that represents the Juz
            const parentJuzContainer = element.closest(".JuzView_juzContainer__L8HsL"); // replace with actual class
            if (parentJuzContainer) {
                const juzText = parentJuzContainer.querySelector(".JuzView_juzTitle__DjSou span:last-child")?.textContent;
                if (juzText) juz = juzText.trim();
            }
        }

        // Restore checked state from storage
        chrome.storage.local.get({ memorizedSurahs: {} }, (result) => {
            const memorized = result.memorizedSurahs;
            if (memorized[key]?.[juz]) {
                newCheckbox.checked = true;
            }
        });

        // Click listener
        newCheckbox.addEventListener('click', (event) => {
            event.stopPropagation();
            const isChecked = newCheckbox.checked;

            chrome.storage.local.get({ memorizedSurahs: {} }, (result) => {
                const updated = result.memorizedSurahs;

                if (!updated[key]) updated[key] = {};
                updated[key][juz] = isChecked;

                chrome.storage.local.set({ memorizedSurahs: updated });
            });
        });

        element.dataset.checkboxInjected = 'true';
        element.appendChild(newCheckbox);
    });
}


function homepageObserver() {
    const container = document.body;

    const observer = new MutationObserver((mutationsList, observer) => {
        injectCheckboxes();
    });
    observer.observe(container, { childList: true, subtree: true });
    injectCheckboxes();
}
homepageObserver();