// Format keybind nicely
function formatKeybind(keysArray) {
  return keysArray
    .map(code => {
      if (code.startsWith("Key")) return code.replace("Key", "");
      if (code.startsWith("Digit")) return code.replace("Digit", "");
      if (code === "Space") return "Space";
      if (code === "Enter") return "Enter";
      if (code.startsWith("Arrow")) return code.replace("Arrow", "") + " Arrow";
      if (code.startsWith("Control")) return "Ctrl";
      if (code.startsWith("Alt")) return "Alt";
      if (code.startsWith("Shift")) return "Shift";
      return code;
    })
    .join(" + ");
}

document.addEventListener('DOMContentLoaded', function() {
  // Retrieve and display saved time saved
  chrome.storage.local.get(['focusCount'], function(result) {
    let focusCount = result.focusCount || 0;
    let timeUnit = focusCount < 60 ? 'Seconds' : 'Minutes';
    let timeValue = focusCount < 60 ? focusCount : (focusCount / 60).toFixed(1);
    document.getElementById('timeSaved').textContent = `Time Saved: ${timeValue} ${timeUnit}`;
  });

  // Toggle enable/disable
  document.querySelector('#toggle input').addEventListener('change', function() {
    chrome.storage.local.set({ isEnabled: this.checked });
  });

  chrome.storage.local.get(['isEnabled'], function(result) {
    document.querySelector('#toggle input').checked = result.isEnabled !== false;
  });

  // Load current keybind
  chrome.storage.local.get(['customKeybind'], function(result) {
    const display = document.getElementById('currentKeybind');
    if (result.customKeybind) {
      display.textContent = "Current Shortcut: " + formatKeybind(result.customKeybind.keys);
    } else {
      display.textContent = "Current Shortcut: Ctrl + Space";
    }
  });

  // Set new keybind (two-key combo)
  document.getElementById('setKeybind').addEventListener('click', function() {
    const display = document.getElementById('currentKeybind');
    display.textContent = "Press two keys...";

    let pressedKeys = new Set();

    function keyHandler(event) {
      event.preventDefault();
      pressedKeys.add(event.code);

      if (pressedKeys.size === 2) {
        const keysArray = Array.from(pressedKeys);

        const keybind = { keys: keysArray };

        chrome.storage.local.set({ customKeybind: keybind }, function() {
          display.textContent = "Current Shortcut: " + formatKeybind(keysArray);
        });

        pressedKeys.clear();
        document.removeEventListener('keydown', keyHandler, true);
      }
    }

    document.addEventListener('keydown', keyHandler, true);
  });
});
