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
  // Find all input elements that are text or search fields
  const inputs = [...document.querySelectorAll('input[type="text"], input[type="search"]')];

  // Filter out inputs that are not visible
  const visibleInputs = inputs.filter(input => input.offsetParent !== null && !input.disabled);

  // Calculate 25% of the window's inner height
  const quarterPageHeight = window.innerHeight * 0.25;

  // Further filter by checking if the input is within the first 25% of the page
  const likelySearchInputs = visibleInputs.filter(input => {
    const rect = input.getBoundingClientRect();
    return rect.top <= quarterPageHeight;
  });

  // If a likely search input is found, focus on it
  if (likelySearchInputs.length > 0) {
    likelySearchInputs[0].focus();
  }
}

// Allows for manual focusing of the search input by pressing Ctrl + Space
function manualFocusSearchInput() {
  focusSearchInput();
}

// Allows the user to focus on the search input by pressing Ctrl + Space on command
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.code === 'Space') {
    manualFocusSearchInput();
  }
});

// If the current page is the homepage of the website and is not an excluded search engine, focus on the search box
if (isHomepage && !excluded) {
  focusSearchInput();
}
