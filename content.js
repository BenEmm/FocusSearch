// Array of search engines to exclude from the auto-focus feature
const excludedSearchEngines = ['google.com', 'google.co.uk', 'bing.com', 'yahoo.com', 'uk.yahoo.com', 'duckduckgo.com'];

// Get the current page URL and homepage URL of the website
const currentUrl = window.location.href;
const homepageUrl = window.location.protocol + '//' + window.location.host + '/';

// Check if the current page URL matches the homepage URL of the website
const isHomepage = currentUrl === homepageUrl;

// Check if the current page is an excluded search engine
const excluded = excludedSearchEngines.some(domain => currentUrl.includes(domain));

// Focus on the search box
function focusSearchInput() {
  // If the current page is the homepage of the website and is not an excluded search engine, find and focus on the search box
  // Find the first input element that is a text or search field
  const searchInput = [...document.querySelectorAll('input[type="text"], input[type="search"]')].find(input => input.offsetParent !== null && !input.disabled);

  // If a search input is found, focus on it
  if (searchInput) {
    searchInput.focus();
  }
}

// Allows for manual focusing of the search input by pressing Ctrl + Space.
function manualFocusSearchInput() {
  focusSearchInput();
}

// Allows the user to focus on the search input by pressing Ctrl + Space on command.
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.code === 'Space') {
    manualFocusSearchInput();
  }
});

// If the current page is the homepage of the website and is not an excluded search engine, focus on the search box
if (isHomepage && !excluded) {
  focusSearchInput();
}
