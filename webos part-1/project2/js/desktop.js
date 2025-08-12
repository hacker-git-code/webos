// Desktop management

// Store desktop icons
let desktopIcons = [];

// Initialize desktop
export function initializeDesktop() {
  const desktop = document.getElementById('desktop');
  
  // Create desktop icons
  createDesktopIcons();
  
  // Set up desktop context menu
  setupDesktopContextMenu(desktop);
  
  // Listen for theme changes
  window.EventBus.subscribe('themeChanged', updateDesktopForTheme);
}

// Create desktop icons
function createDesktopIcons() {
  // Default desktop icons
  desktopIcons = [
    { id: 'documents', name: 'Documents', icon: 'fa-folder', type: 'folder' },
    { id: 'pictures', name: 'Pictures', icon: 'fa-images', type: 'folder' },
    { id: 'music', name: 'Music', icon: 'fa-music', type: 'folder' },
    { id: 'downloads', name: 'Downloads', icon: 'fa-download', type: 'folder' },
    { id: 'notes', name: 'Notes', icon: 'fa-sticky-note', type: 'app' },
    { id: 'calculator', name: 'Calculator', icon: 'fa-calculator', type: 'app' },
    { id: 'settings', name: 'Settings', icon: 'fa-cog', type: 'app' }
  ];
  
  const desktop = document.getElementById('desktop');
  
  // Create and append icons to desktop
  desktopIcons.forEach(icon => {
    const iconElement = createIconElement(icon);
    desktop.appendChild(iconElement);
  });
}

// Create a desktop icon element
function createIconElement(icon) {
  const iconElement = document.createElement('div');
  iconElement.className = 'desktop-icon';
  iconElement.id = `desktop-icon-${icon.id}`;
  iconElement.dataset.id = icon.id;
  iconElement.dataset.type = icon.type;
  
  const iconImg = document.createElement('div');
  iconImg.className = 'desktop-icon-img';
  
  const iconI = document.createElement('i');
  iconI.className = `fas ${icon.icon}`;
  
  iconImg.appendChild(iconI);
  
  const iconLabel = document.createElement('div');
  iconLabel.className = 'desktop-icon-label';
  iconLabel.textContent = icon.name;
  
  iconElement.appendChild(iconImg);
  iconElement.appendChild(iconLabel);
  
  // Add event listeners
  iconElement.addEventListener('click', () => {
    selectIcon(iconElement);
  });
  
  iconElement.addEventListener('dblclick', () => {
    openIcon(icon);
  });
  
  return iconElement;
}

// Select a desktop icon
function selectIcon(iconElement) {
  // Deselect all icons
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.classList.remove('selected');
  });
  
  // Select clicked icon
  iconElement.classList.add('selected');
}

// Open a desktop icon (app or folder)
function openIcon(icon) {
  if (icon.type === 'app') {
    // Open the app
    window.EventBus.publish('openApp', { app: icon.id });
  } else if (icon.type === 'folder') {
    // Open the folder
    window.EventBus.publish('openFolder', { folder: icon.id });
  }
}

// Set up desktop context menu
function setupDesktopContextMenu(desktop) {
  // Create context menu
  const contextMenu = document.createElement('div');
  contextMenu.className = 'context-menu';
  contextMenu.innerHTML = `
    <div class="context-menu-item"><i class="fas fa-th-large"></i> View</div>
    <div class="context-menu-item"><i class="fas fa-sort"></i> Sort By</div>
    <div class="menu-divider"></div>
    <div class="context-menu-item"><i class="fas fa-folder-plus"></i> New Folder</div>
    <div class="context-menu-item"><i class="fas fa-file"></i> New File</div>
    <div class="menu-divider"></div>
    <div class="context-menu-item"><i class="fas fa-paint-brush"></i> Change Background</div>
  `;
  
  document.body.appendChild(contextMenu);
  
  // Show context menu on right click
  desktop.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    // Position the context menu
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;
    
    // Check if menu goes off screen
    const rect = contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      contextMenu.style.left = `${e.clientX - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      contextMenu.style.top = `${e.clientY - rect.height}px`;
    }
    
    // Show the menu
    contextMenu.classList.add('visible');
    
    // Add click listener to hide menu
    const hideMenu = () => {
      contextMenu.classList.remove('visible');
      document.removeEventListener('click', hideMenu);
    };
    
    // Delay adding the click listener to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('click', hideMenu);
    }, 100);
  });
  
  // Handle context menu items
  const menuItems = contextMenu.querySelectorAll('.context-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.textContent.trim();
      
      switch(action) {
        case 'New Folder':
          createNewFolder();
          break;
        case 'Change Background':
          window.EventBus.publish('openApp', { app: 'settings', tab: 'wallpaper' });
          break;
        // Add more actions as needed
      }
    });
  });
}

// Create a new folder on desktop
function createNewFolder() {
  let folderName = 'New Folder';
  let counter = 1;
  
  // Check if folder name already exists
  while (desktopIcons.some(icon => icon.name === folderName)) {
    folderName = `New Folder (${counter})`;
    counter++;
  }
  
  // Create new folder object
  const newFolder = {
    id: `folder-${Date.now()}`,
    name: folderName,
    icon: 'fa-folder',
    type: 'folder'
  };
  
  // Add to desktop icons array
  desktopIcons.push(newFolder);
  
  // Create and append to desktop
  const desktop = document.getElementById('desktop');
  const folderElement = createIconElement(newFolder);
  desktop.appendChild(folderElement);
  
  // Select the new folder
  selectIcon(folderElement);
}

// Update desktop based on theme
function updateDesktopForTheme({ isDark }) {
  // You can update desktop appearance based on theme here
  // For example, change icon colors or desktop background
}