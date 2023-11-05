/**
 * Focus Search Extension - Time Tracking
 *
 * This section of code tracks the cumulative time saved by the user through the extension's operation.
 * It operates under the assumption that manually focusing the search bar with a mouse takes approximately one second (grabbing your mouse and then clicking the search bar)
 * Therefore, each automatic focus event triggered by the extension increments a counter by one, symbolizing one second saved.
 * At 60 seconds, the text changes from "seconds" to "minutes". There is currently no "Hours" variation.
 */


// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Retrieve the stored focus count from local storage
  chrome.storage.local.get(['focusCount'], function(result) {
    // Set default value for focusCount if it's not set
    let focusCount = result.focusCount || 0;
    // Determine the units of time and calculate the value
    let timeUnit = focusCount < 60 ? 'Seconds' : 'Minutes';
    let timeValue = focusCount < 60 ? focusCount : (focusCount / 60).toFixed(1); // Keep one decimal for minutes
    // Update the UI with the time saved
    document.getElementById('timeSaved').textContent = `Time Saved: ${timeValue} ${timeUnit}`;
  });

  // Listen for the toggle button change
  document.querySelector('#toggle input').addEventListener('change', function() {
    // Save the new state of the extension (enabled or disabled)
    chrome.storage.local.set({isEnabled: this.checked});
    // Here you could also send a message to the content script to act upon this change
  });

  // Initialize the toggle state based on saved value
  chrome.storage.local.get(['isEnabled'], function(result) {
    document.querySelector('#toggle input').checked = result.isEnabled !== false; // default to true if not set
  });
});
