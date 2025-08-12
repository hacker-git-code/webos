// Top bar management

// Initialize top bar
export function initializeTopBar() {
  updateClock();
  setInterval(updateClock, 1000);
  
  // Initialize battery icon
  updateBatteryStatus();
  
  // Set up app menu hover effect
  setupAppMenu();
}

// Update the clock in the top bar
function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();
  
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  clock.textContent = `${hours}:${minutes}`;
}

// Simulate battery status
function updateBatteryStatus() {
  const batteryIcon = document.querySelector('#battery-icon i');
  
  // Simulate battery level (random for demo)
  const batteryLevel = Math.floor(Math.random() * 100);
  
  if (batteryLevel > 75) {
    batteryIcon.className = 'fas fa-battery-full';
  } else if (batteryLevel > 50) {
    batteryIcon.className = 'fas fa-battery-three-quarters';
  } else if (batteryLevel > 25) {
    batteryIcon.className = 'fas fa-battery-half';
  } else if (batteryLevel > 10) {
    batteryIcon.className = 'fas fa-battery-quarter';
  } else {
    batteryIcon.className = 'fas fa-battery-empty';
  }
}

// Set up app menu interactions
function setupAppMenu() {
  const appMenu = document.querySelector('.app-menu');
  const menuItems = document.querySelectorAll('.menu-item');
  
  // Handle menu item clicks
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const action = item.textContent.trim();
      
      switch(action) {
        case 'About NebulaOS':
          window.EventBus.publish('openApp', { app: 'about' });
          break;
        case 'Preferences':
          window.EventBus.publish('openApp', { app: 'preferences' });
          break;
        case 'App Store':
          window.EventBus.publish('openApp', { app: 'appstore' });
          break;
        case 'Restart':
          confirmRestart();
          break;
        case 'Shut Down':
          confirmShutdown();
          break;
      }
    });
  });
}

// Confirm restart
function confirmRestart() {
  if (confirm('Are you sure you want to restart NebulaOS?')) {
    // Simulate restart
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Confirm shutdown
function confirmShutdown() {
  if (confirm('Are you sure you want to shut down NebulaOS?')) {
    // Simulate shutdown
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; color: white;">System has been shut down. Refresh to restart.</div>';
      document.body.style.opacity = '1';
      document.body.style.backgroundColor = '#000';
    }, 1000);
  }
}