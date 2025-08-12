// Dock management

// Store dock items
const dockItems = [
  { id: 'finder', name: 'Finder', icon: 'fa-folder' },
  { id: 'browser', name: 'Browser', icon: 'fa-globe' },
  { id: 'mail', name: 'Mail', icon: 'fa-envelope' },
  { id: 'notes', name: 'Notes', icon: 'fa-sticky-note' },
  { id: 'calculator', name: 'Calculator', icon: 'fa-calculator' },
  { id: 'calendar', name: 'Calendar', icon: 'fa-calendar-alt' },
  { id: 'photos', name: 'Photos', icon: 'fa-images' },
  { id: 'settings', name: 'Settings', icon: 'fa-cog' }
];

// Active apps (shows indicator dot)
let activeApps = new Set();

// Initialize dock
export function initializeDock() {
  const dock = document.getElementById('dock');
  
  // Create dock items
  dockItems.forEach(item => {
    const dockItem = createDockItem(item);
    dock.appendChild(dockItem);
  });
  
  // Add subtle hover effect to dock
  addDockHoverEffect(dock);
  
  // Listen for app open/close events
  window.EventBus.subscribe('appOpened', handleAppOpened);
  window.EventBus.subscribe('appClosed', handleAppClosed);
}

// Create a dock item
function createDockItem(item) {
  const dockItem = document.createElement('div');
  dockItem.className = 'dock-item';
  dockItem.dataset.id = item.id;
  
  const icon = document.createElement('i');
  icon.className = `fas ${item.icon}`;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'dock-tooltip';
  tooltip.textContent = item.name;
  
  dockItem.appendChild(icon);
  dockItem.appendChild(tooltip);
  
  // Add click event to open app
  dockItem.addEventListener('click', () => {
    window.EventBus.publish('openApp', { app: item.id });
  });
  
  return dockItem;
}

// Add hover effect to dock (magnification)
function addDockHoverEffect(dock) {
  // This is a simplified version of the dock hover effect
  // For a more advanced effect, we would use mouse position to create dynamic magnification
  
  dock.addEventListener('mousemove', (e) => {
    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;
    
    // Update each dock item based on mouse position
    const dockItems = dock.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const itemX = itemRect.left + itemRect.width / 2 - dockRect.left;
      
      // Calculate distance from mouse to item center
      const distance = Math.abs(mouseX - itemX);
      
      // Apply scale based on distance (closer = larger)
      const scale = Math.max(1, 1.5 - distance * 0.01);
      
      // Apply the scale
      item.style.transform = `scale(${scale})`;
    });
  });
  
  // Reset scales when mouse leaves the dock
  dock.addEventListener('mouseleave', () => {
    const dockItems = dock.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
      item.style.transform = '';
    });
  });
}

// Handle app opened event
function handleAppOpened({ app }) {
  // Add app to active apps
  activeApps.add(app);
  
  // Update dock item to show it's active
  const dockItem = document.querySelector(`.dock-item[data-id="${app}"]`);
  if (dockItem) {
    dockItem.classList.add('active');
  }
}

// Handle app closed event
function handleAppClosed({ app }) {
  // Remove app from active apps
  activeApps.delete(app);
  
  // Update dock item to show it's no longer active
  const dockItem = document.querySelector(`.dock-item[data-id="${app}"]`);
  if (dockItem) {
    dockItem.classList.remove('active');
  }
}