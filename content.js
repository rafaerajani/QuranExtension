// content.js - Quran Memorisation Tracker

console.log("content.js loaded");

// ----------------------------
// Storage object
// ----------------------------
let memorisationData = {}; // Stores memorisation state

// ----------------------------
// Load saved data from Chrome storage
// ----------------------------
function loadProgress(callback) {
    chrome.storage.local.get(['memorisationData'], (result) => {
        memorisationData = result.memorisationData || {};
        if (callback) callback();
    });
}

// ----------------------------
// Save updated data to Chrome storage
// ----------------------------
function saveProgress(key, value) {
    memorisationData[key] = value;
    chrome.storage.local.set({ memorisationData });
}

// ----------------------------
// Create a checkbox and attach it to a DOM element
// ----------------------------
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

// ----------------------------
// Determine page type from URL
// ----------------------------
function getPageType() {
    const path = window.location.pathname; // e.g., /2, /juz/1, /page/23
    const search = window.location.search; // e.g., ?startingVerse=5

    if (path.startsWith("/juz/")) return 'juz';
    if (path.startsWith("/page/")) return 'page';
    if (search.includes("startingVerse")) return 'verse';
    return 'surah'; // Default fallback
}

// ----------------------------
// Generate unique storage key based on page type
// ----------------------------
function generateKey(pageType) {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    switch (pageType) {
        case 'surah':
            const surahNumber = path.split('/')[1];
            return `surah_${surahNumber}`;
        case 'juz':
            const juzNumber = path.split('/')[2];
            return `juz_${juzNumber}`;
        case 'page':
            const pageNumber = path.split('/')[2];
            return `page_${pageNumber}`;
        case 'verse':
            const surah = path.split('/')[1];
            const verse = searchParams.get("startingVerse");
            return `verse_${surah}_${verse}`;
        default:
            return 'unknown';
    }
}

// ----------------------------
// Initialize checkboxes for the page
// ----------------------------
// ...existing code...

function initUI() {
    // Only run on homepage
    if (window.location.pathname !== "/") return;

    // Select all Surah rows
    const surahRows = document.querySelectorAll('.SurahPreviewRow_surahNumber__uuxf9');
    surahRows.forEach((row) => {
        const surahNumberSpan = row.querySelector('span');
        if (!surahNumberSpan) return;

        const surahNumber = surahNumberSpan.innerText.trim();
        const key = `surah_${surahNumber}`;

        // Avoid adding multiple checkboxes
        if (row.querySelector('input[type="checkbox"]')) return;

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

        row.appendChild(checkbox);
    });
}

// ...existing code...


// ----------------------------
// Run
// ----------------------------
loadProgress(initUI);
