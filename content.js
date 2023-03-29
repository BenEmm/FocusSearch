// Array of search engines to exclude from the auto-focus feature
const excludedSearchEngines = ['google.com', 'google.co.uk', 'bing.com', 'yahoo.com', 'uk.yahoo.com', 'duckduckgo.com'];

// Get the current page URL
const currentUrl = window.location.href;

// Check if the current page URL contains an excluded search engine domain
const excluded = excludedSearchEngines.some(domain => currentUrl.includes(domain));

// If the current page is not an excluded search engine, find and focus on the search box
if (!excluded) {
  // Find the first input element that is a text or search field
  const searchInput = [...document.querySelectorAll('input[type="text"], input[type="search"]')].find(input => input.offsetParent !== null);

  // If a search input is found, focus on it
  if (searchInput) {
    searchInput.focus();
  }
}