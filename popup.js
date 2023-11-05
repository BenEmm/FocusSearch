let toggle = document.querySelector("#toggle input");

// Get the current state of the extension
chrome.storage.local.get(['focusSearchEnabled'], function(result) {
  toggle.checked = result.focusSearchEnabled !== false;
});

// Save the new state when the toggle is clicked
toggle.onchange = function(event) {
  chrome.storage.local.set({focusSearchEnabled: toggle.checked}, function() {
    console.log('Focus Search is ' + (toggle.checked ? 'enabled' : 'disabled'));
  });
};
