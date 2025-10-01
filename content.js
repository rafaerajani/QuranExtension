// content.js - Quran Memorisation Tracker

console.log("content.js loaded");

let memorisationData = {}; // Stores memorisation state

function loadProgress(callback) {
    chrome.storage.local.get(['memorisationData'], (result) => {
        memorisationData = result.memorisationData || {};
        if (callback) callback();
    });
}

function saveProgress(key, value) {
    memorisationData[key] = value;
    chrome.storage.local.set({ memorisationData });
}

function createCheckbox(element, key) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginLeft = '8px';
    checkbox.checked = memorisationData[key] || false;

    // Save changes on toggle
    checkbox.addEventListener('change', () => {
        saveProgress(key, checkbox.checked);
    });

    // Append the checkbox to the element
    element.appendChild(checkbox);
}

function initUI() {
    // Remove homepage-only restriction to work on all pages
    
    // Select all Surah rows by their number div
    const surahRows = document.querySelectorAll('.SurahPreviewRow_surahNumber__uuxf9');
    surahRows.forEach((row) => {
        // Find the corresponding surah name div in the same row container
        const surahContainer = row.closest('.SurahPreviewRow_left__TV2AO');
        if (!surahContainer) return;
        
        const surahNameDiv = surahContainer.querySelector('.SurahPreviewRow_surahName__IHiSd');
        if (!surahNameDiv) return;

        // Use the surah name as the storage key
        const surahName = surahNameDiv.innerText.trim();
        const key = `surah_${surahName}`; // e.g., "surah_Al-Fatihah"

        // Avoid adding multiple checkboxes
        if (surahNameDiv.querySelector('input[type="checkbox"]')) return;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginLeft = '8px';
        checkbox.checked = memorisationData[key] || false;

        // Prevent navigation when clicking checkbox
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        checkbox.addEventListener('change', () => {
            saveProgress(key, checkbox.checked);
        });

        surahNameDiv.appendChild(checkbox);
    });
}

// Function to observe DOM changes
function observePageChanges() {
    // Target the main container where tab content changes occur
    const targetNode = document.body;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check if relevant elements were added or removed
            if (mutation.type === 'childList' && 
                (document.querySelector('.SurahPreviewRow_surahNumber__uuxf9'))) {
                initUI();
            }
        });
    });

    // Start observing with specific configuration
    observer.observe(targetNode, {
        childList: true,    // Watch for changes in direct children
        subtree: true,      // Watch for changes in all descendants
        attributes: false    // Don't watch for attribute changes
    });
}

// Initialize when the page loads
loadProgress(() => {
    initUI();
    observePageChanges();
});