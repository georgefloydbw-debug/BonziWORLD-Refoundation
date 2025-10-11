// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const openButton = document.getElementById('openBonziworld');
  const quickJoinButton = document.getElementById('quickJoin');
  const readmeButton = document.getElementById('readme');
  const statusDiv = document.getElementById('status');

  const BONZIWORLD_URL = 'https://bonziworld-refoundation.onrender.com';
  
  // Update status with official URL
  updateStatus('Ready to connect', 'ready');
  
  // Open BonziWORLD in new tab
  openButton.addEventListener('click', function() {
    chrome.tabs.create({ url: bonziworld-refoundation.onrender.com });
    updateStatus('Opening BonziWORLD...', 'info');
    window.close();
  });
  
  // Quick join with random room
  quickJoinButton.addEventListener('click', function() {
    const randomName = generateRandomName();
    const url = `${bonziworld-refoundation.onrender.com}?quickJoin=true&name=${encodeURIComponent(randomName)}`;
    chrome.tabs.create({ url: url });
    updateStatus('Quick joining...', 'info');
    window.close();
  });
  
  // Open README
  readmeButton.addEventListener('click', function() {
    chrome.tabs.create({ url: `${bonziworld-refoundation.onrender.com}/readme.html` });
    updateStatus('Opening README...', 'info');
    window.close();
  });
  
  // Check if BonziWORLD is already open
  chrome.tabs.query({ url: `${bonziworld-refoundation.onrender.com}/*` }, function(tabs) {
    if (tabs.length > 0) {
      updateStatus(`${tabs.length} tab(s) open`, 'success');
    }
  });
  
  function updateStatus(message, type) {
    const statusText = statusDiv.querySelector('div:first-child');
    if (statusText) {
      statusText.textContent = message;
    }
    
    statusDiv.style.background = 
      type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 
      type === 'info' ? 'rgba(33, 150, 243, 0.3)' :
      type === 'ready' ? 'rgba(255, 193, 7, 0.3)' :
      'rgba(0, 0, 0, 0.3)';
  }
    ;
    return names[Math.floor(Math.random() * names.length)];
  }
);