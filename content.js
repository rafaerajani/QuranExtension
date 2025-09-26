// 1. Initialization / Page Load
console.log("content.js loaded"); // Test that script is running

// 2. Define storage keys or structure
// Example: store memorisation status by surah or juz IDs
// let memorisationData = {}; 

// 3. Function to load saved progress from Chrome storage
function loadProgress() {
    // Use chrome.storage.local.get to fetch saved data
    // Example:
    // chrome.storage.local.get(['memorisationData'], (result) => { ... });
}

// 4. Function to save progress when a checkbox is clicked
function saveProgress(key, value) {
    // Update the memorisationData object and save with chrome.storage.local.set
}

// 5. Function to create a checkbox next to a DOM element
function createCheckbox(element, id) {
    // Create <input type="checkbox">
    // Set checkbox.checked based on memorisationData
    // Add event listener for change → call saveProgress()
    // Append the checkbox to the DOM element
}

// 6. Function to initialize the UI
function initUI() {
    // Select all surahs/juz/ayah elements on the page (document.querySelectorAll)
    // Loop through them and call createCheckbox for each
}

// 7. Run on page load
loadProgress();
initUI();
