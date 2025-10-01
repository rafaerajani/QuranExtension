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

    // Prevent navigation when clicking checkbox
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Save changes on toggle
    checkbox.addEventListener('change', () => {
        saveProgress(key, checkbox.checked);
    });

    // Append the checkbox to the element
    element.appendChild(checkbox);
}

function clearAllProgress() {
    // Clear the storage
    memorisationData = {};
    chrome.storage.local.set({ memorisationData });

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function addClearButton() {
    const tabsContainer = document.querySelector('.Tabs_container__AsP9A');
    if (!tabsContainer || tabsContainer.querySelector('.clear-all-button')) return;

    const clearButton = document.createElement('button');
    clearButton.className = 'Button_base__52bgM Button_primary__YDSAz Button_small__pwmU9 Button_pill__a6C8J Button_compact__U3Ejr clear-all-button';
    clearButton.style.marginLeft = 'auto'; // Keep the right positioning
    clearButton.setAttribute('data-auto-flip-icon', 'true');
    
    // Create span for the content (like the original button)
    const buttonContent = document.createElement('span');
    buttonContent.className = 'Button_content__HbnrW';
    buttonContent.textContent = 'Clear All';
    clearButton.appendChild(buttonContent);

    clearButton.addEventListener('click', clearAllProgress);
    tabsContainer.appendChild(clearButton);
}

function initUI() {
    // Remove homepage-only restriction to work on all pages
    
    // Add the clear button
    addClearButton();
    
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

        // Use the createCheckbox function instead of duplicating code
        createCheckbox(surahNameDiv, key);
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
    
    // Make sure clear button is added after DOM changes
    addClearButton();
}

// Initialize when the page loads
loadProgress(() => {
    initUI();
    observePageChanges();
});