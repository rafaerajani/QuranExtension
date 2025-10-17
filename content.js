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
    const surahElement = document.querySelectorAll(".SurahPreviewRow_surahName__IHiSd");
    if (surahElement.length === 0) {
        setTimeout(injectCheckboxes, 100); 
        return;
    }
    else {
        surahElement.forEach((element) => {
            if (element.dataset.checkboxInjected) return;

            const newCheckbox = document.createElement('input');
            newCheckbox.type = 'checkbox';
            newCheckbox.style.marginLeft = "8px";
            newCheckbox.style.width = "16px";
            newCheckbox.style.height = "16px";
            const key = getSurahName(element);
            newCheckbox.dataset.surahKey = key

            chrome.storage.local.get({ memorizedSurahs: {} }, (result) => {
                const memorized = result.memorizedSurahs;
                if(memorized[key]) {
                    newCheckbox.checked = true;
                //        console.log(`✅ Restored: ${key} is marked memorized`);
                } //else {
                //    console.log(`⬜ Restored: ${key} is not memorized`);
                //}
            })
            // chrome.storage.local.get(null, (result) => {
            // console.log("Stored data:", result);
            // });
            newCheckbox.addEventListener('click', (event) => {
                event.stopPropagation();
                // TODO: store checked state
                const isChecked = newCheckbox.checked;
                
                chrome.storage.local.get({ memorizedSurahs: {} }, (result) => {
                    const updated = result.memorizedSurahs;
                    updated[key] = isChecked;
                    chrome.storage.local.set({ memorizedSurahs: updated }, () => {
                        // console.log(isChecked
                        //     ? `💾 Saved: ${key} = memorized`
                        //     : `💾 Saved: ${key} = unmemorized`
                        // );
                    });
                });
                const currentView = getCurrentView();

                if (currentView === 'juz') {
                    // ✅ Only update this instance / Juz part in storage
                    console.log("JUZ!!!!!!!!!!!!!!!");
                } else {
                    // ✅ Surah or Revelation view: mark all instances
                    console.log("SURAH or REVELATION!!!!!!!!!!!!!!!");
                }
            });

            element.dataset.checkboxInjected = 'true';
            element.appendChild(newCheckbox);

        })
    }
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