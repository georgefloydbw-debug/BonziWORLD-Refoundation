// options.js
document.addEventListener('DOMContentLoaded', function() {
  const notifications = document.getElementById('notifications');
  const quickActions = document.getElementById('quickActions');
  const saveButton = document.getElementById('saveSettings');
  const statusMessage = document.getElementById('statusMessage');

  // Load saved settings
  chrome.storage.sync.get([
    'notifications',
    'quickActions'
  ], function(settings) {
    notifications.checked = settings.notifications !== false;
    quickActions.checked = settings.quickActions !== false;
  });

  // Save settings
  saveButton.addEventListener('click', function() {
    const settings = {
      notifications: notifications.checked,
      quickActions: quickActions.checked
    };

    chrome.storage.sync.set(settings, function() {
      showStatus('Settings saved successfully!', 'success');
    });
  });

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status ' + type;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
  }
});