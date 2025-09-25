// Array of search engines to exclude from the auto-focus feature
const excludedSearchEngines = [
  'google.com',
  'google.co.uk',
  'bing.com',
  'yahoo.com',
  'uk.yahoo.com',
  'duckduckgo.com'
];

const currentUrl = window.location.href;
const homepageUrl = window.location.protocol + '//' + window.location.host + '/';
const isHomepage = currentUrl === homepageUrl;
const excluded = excludedSearchEngines.some(domain => currentUrl.includes(domain));

// Increment the focus counter
function incrementFocusCounter() {
  chrome.storage.local.get(['focusCount'], function(result) {
    let focusCount = result.focusCount || 0;
    focusCount++;
    chrome.storage.local.set({ focusCount: focusCount });
  });
}

// Focus logic
function focusSearchInput() {
  const inputs = [...document.querySelectorAll('input[type="text"], input[type="search"]')];
  const visibleInputs = inputs.filter(input => input.offsetParent !== null && !input.disabled);

  const quarterPageHeight = window.innerHeight * 0.25;
  const likelySearchInputs = visibleInputs.filter(input => {
    const rect = input.getBoundingClientRect();
    return rect.top <= quarterPageHeight;
  });

  if (likelySearchInputs.length > 0) {
    likelySearchInputs[0].focus();
    incrementFocusCounter();
  }
}

function maybeFocusSearchInput() {
  chrome.storage.local.get(['isEnabled'], function(result) {
    if (result.isEnabled !== false) {
      focusSearchInput();
    }
  });
}

function manualFocusSearchInput() {
  chrome.storage.local.get(['isEnabled'], function(result) {
    if (result.isEnabled !== false) {
      focusSearchInput();
    }
  });
}

// --- Two-key combo support ---
let activeKeys = new Set();
let currentKeybind = { keys: ["ControlLeft", "Space"] }; // default combo

// Load the keybind at startup
chrome.storage.local.get(['customKeybind'], function(result) {
  if (result.customKeybind && result.customKeybind.keys && Array.isArray(result.customKeybind.keys)) {
    currentKeybind = result.customKeybind;
  }
});

// Keep keybind updated live when popup changes it
chrome.storage.onChanged.addListener(function(changes) {
  if (changes.customKeybind && changes.customKeybind.newValue) {
    const newBind = changes.customKeybind.newValue;
    if (newBind.keys && Array.isArray(newBind.keys)) {
      currentKeybind = newBind;
    }
  }
});

// Detect key combos
document.addEventListener('keydown', function(event) {
  activeKeys.add(event.code);

  // Check if both keys in currentKeybind are pressed
  if (currentKeybind && currentKeybind.keys.every(k => activeKeys.has(k))) {
    manualFocusSearchInput();
  }
});

document.addEventListener('keyup', function(event) {
  activeKeys.delete(event.code);
});

// Auto-focus on homepage (if not excluded)
if (isHomepage && !excluded) {
  maybeFocusSearchInput();
}
