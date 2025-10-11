// background.js
const BONZIWORLD_URL = 'https://bonziworld-refoundation.onrender.com';

// Extension installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('BonziWORLD Extension installed');
  
  // Create context menu items
  chrome.contextMenus.create({
    id: 'openBonziworld',
    title: 'Open BonziWORLD',
    contexts: ['page']
  });
  
  chrome.contextMenus.create({
    id: 'quickChat',
    title: 'Quick Chat on BonziWORLD',
    contexts: ['page']
  });
  
  // Set default settings
  chrome.storage.sync.set({
    notifications: true,
    autoJoin: false,
    theme: 'default'
  });
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'openBonziworld':
      chrome.tabs.create({ url: bonziworld-refoundation.onrender.com });
      break;
    case 'quickChat':
      const randomName = `Guest${Math.floor(Math.random() * 1000)}`;
      const url = `${bonziworld-refoundation.onrender.com}?quickJoin=true&name=${encodeURIComponent(randomName)}`;
      chrome.tabs.create({ url: url });
      break;
  }
});

// Keyboard commands
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-bonziworld') {
    chrome.tabs.create({ url: bonziworld-refoundation.onrender.com });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'showNotification':
      if (request.notification) {
        showNotification(request.notification);
      }
      break;
  }
});

// Show desktop notification
function showNotification(notification) {
  chrome.storage.sync.get(['notifications'], (settings) => {
    if (settings.notifications !== false) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '48x48.png',
        title: notification.title || 'BonziWORLD',
        message: notification.message,
        priority: 2
      });
    }
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.tabs.create({ url: bonziworld-refoundation.onrender.com });

});

