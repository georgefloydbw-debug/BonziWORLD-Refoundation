// content.js - Enhances BonziWORLD website
(function() {
  'use strict';
  
  const OFFICIAL_URL = 'https://bonziworld-refoundation.onrender.com';
  
  console.log('🎨 BonziWORLD Extension loaded');
  
  // Check if we're on the official BonziWORLD page
  if (!isOfficialBonziWORLDPage()) {
    console.log('❌ Not on official BonziWORLD page, extension inactive');
    return;
  }
  
  console.log('✅ On official BonziWORLD site, initializing extension...');
  initExtension();
  
  function isOfficialBonziWORLDPage() {
    const currentHost = window.location.hostname;
    return currentHost === 'bonziworld-refoundation.onrender.com' ||
           currentHost === 'localhost' ||
           currentHost === '127.0.0.1';
  }
  
  function initExtension() {
    // Add official website badge
    addOfficialBadge();
    
    // Add quick access buttons
    addQuickAccess();
    
    // Apply extension styles
    applyExtensionStyles();
    
    // Notify background script
    chrome.runtime.sendMessage({
      action: 'officialSiteLoaded',
      url: window.location.href
    });
  }
  
  function addOfficialBadge() {
    const badge = document.createElement('div');
    badge.innerHTML = `
      <div style="
        position: fixed;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: bold;
        border: 2px solid #ffd700;
        z-index: 10000;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
      ">
        ✅ Official v1.6.2
      </div>
    `;
    
    badge.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'showNotification',
        notification: {
          title: 'Official BonziWORLD',
          message: 'You are on the official BonziWORLD Refoundation website!'
        }
      });
    });
    
    document.body.appendChild(badge);
  }
  
  function addQuickAccess() {
    const quickAccess = document.createElement('div');
    quickAccess.innerHTML = `
      <div style="
        position: fixed;
        bottom: 80px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 9999;
      ">
        <button onclick="extensionQuickJoin()" style="
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        " title="Quick Join">🚀</button>
        
        <button onclick="extensionProgress()" style="
          background: #FF9800;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        " title="Development Progress">📊</button>
      </div>
    `;
    
    document.body.appendChild(quickAccess);
  }
  
  // Global functions for quick access buttons
  window.extensionQuickJoin = function() {
    if (window.socket) {
      const randomName = `ExtensionUser${Math.floor(Math.random() * 1000)}`;
      window.socket.emit('login', {
        name: randomName,
        room: ''
      });
      
      chrome.runtime.sendMessage({
        action: 'showNotification',
        notification: {
          title: 'Quick Join',
          message: `Joining as ${randomName}`
        }
      });
    }
  };
  
  window.extensionProgress = function() {
    if (window.BonziProgress) {
      BonziProgress.show();
    }
  };
  
  function applyExtensionStyles() {
    const styles = `
      <style>
        /* Quick action button hover effects */
        button[onclick*="extension"]:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          button[onclick*="extension"] {
            width: 40px !important;
            height: 40px !important;
            font-size: 16px !important;
          }
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
  }
  
  console.log('🎉 BonziWORLD Extension fully loaded!');
})();