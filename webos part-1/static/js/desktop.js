// Desktop icons configuration
const desktopIcons = [
    { name: 'Finder', icon: 'fa-folder-open', action: () => openApp('finder'), color: '#4A90E2' },
    { name: 'Notes', icon: 'fa-sticky-note', action: () => openApp('notes'), color: '#FFD700' },
    { name: 'Music', icon: 'fa-music', action: () => openApp('music'), color: '#FF2D55' },
    { name: 'Calendar', icon: 'fa-calendar-alt', action: () => openApp('calendar'), color: '#34C759' },
    { name: 'Photos', icon: 'fa-images', action: () => openApp('photos'), color: '#FF9500' },
    { name: 'Terminal', icon: 'fa-terminal', action: () => openApp('terminal'), color: '#333333' },
    { name: 'Settings', icon: 'fa-cogs', action: () => openApp('settings'), color: '#8E8E93' },
    { name: 'Browser', icon: 'fa-globe', action: () => openApp('browser'), color: '#007AFF' },
    { name: 'Calculator', icon: 'fa-calculator', action: () => openApp('calculator'), color: '#FFCC00' },
    { name: 'Mail', icon: 'fa-envelope', action: () => openApp('mail'), color: '#007AFF' },
    { name: 'Weather', icon: 'fa-cloud-sun', action: () => openApp('weather'), color: '#5AC8FA' },
    { name: 'App Store', icon: 'fa-store', action: () => openApp('app store'), color: '#5856D6' },
    { name: 'Trash', icon: 'fa-trash', action: () => openApp('trash'), color: '#D0021B' },
    { name: 'Files', icon: 'fa-folder', action: () => openApp('files'), color: '#FF9500' }
];

// Initialize desktop
export function initializeDesktop() {
    const desktop = document.getElementById('desktop');
    
    // Create desktop icons
    desktopIcons.forEach((icon, index) => {
        const iconElement = createDesktopIcon(icon, index);
        desktop.appendChild(iconElement);
    });
    
    // Add wallpaper with fade-in effect
    const wallpaper = document.querySelector('.wallpaper');
    if (wallpaper) {
        wallpaper.style.opacity = '0';
        setTimeout(() => {
            wallpaper.style.transition = 'opacity 0.5s ease';
            wallpaper.style.opacity = '1';
        }, 100);
    }
}

// Create desktop icon with enhanced styling
function createDesktopIcon(icon, index) {
    const iconElement = document.createElement('div');
    iconElement.className = 'desktop-icon';
    iconElement.style.setProperty('--icon-color', icon.color);
    iconElement.style.animationDelay = `${index * 0.1}s`;
    
    iconElement.innerHTML = `
        <div class="icon-container">
            <i class="fas ${icon.icon}"></i>
        </div>
        <span>${icon.name}</span>
    `;
    
    // Always use EventBus for opening apps for full compatibility
    iconElement.onclick = () => {
        if (window.EventBus && window.EventBus.publish) {
            window.EventBus.publish('app:open', { name: icon.name });
        }
    };

    
    iconElement.addEventListener('dblclick', (e) => {
        clearTimeout(clickTimeout);
        e.preventDefault();
        icon.action();
    });
    
    // Add context menu
    iconElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, icon);
    });
    
    return iconElement;
}

// Show context menu for desktop icons
function showContextMenu(e, icon) {
    const menu = document.createElement('div');
    menu.className = 'context-menu glass';
    menu.style.position = 'fixed';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    
    menu.innerHTML = `
        <div class="menu-item" onclick="openApp('${icon.name.toLowerCase()}')">
            <i class="fas fa-play"></i>
            Open
        </div>
        <div class="menu-item" onclick="renameIcon('${icon.name}')">
            <i class="fas fa-edit"></i>
            Rename
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item" onclick="createShortcut('${icon.name}')">
            <i class="fas fa-link"></i>
            Create Shortcut
        </div>
        <div class="menu-item" onclick="deleteIcon('${icon.name}')">
            <i class="fas fa-trash"></i>
            Delete
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Remove menu on click outside
    const removeMenu = () => {
        menu.remove();
        document.removeEventListener('click', removeMenu);
    };
    
    setTimeout(() => {
        document.addEventListener('click', removeMenu);
    }, 0);
}

// Open application
function openApp(appName) {
    EventBus.publish('app:open', { name: appName });
}

// Handle desktop context menu
document.getElementById('desktop').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    const menu = document.createElement('div');
    menu.className = 'context-menu glass';
    menu.style.position = 'fixed';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    
    menu.innerHTML = `
        <div class="menu-item" onclick="createNewFolder()">
            <i class="fas fa-folder-plus"></i>
            New Folder
        </div>
        <div class="menu-item" onclick="uploadFiles()">
            <i class="fas fa-upload"></i>
            Upload Files
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item" onclick="refreshDesktop()">
            <i class="fas fa-sync"></i>
            Refresh
        </div>
        <div class="menu-item" onclick="changeWallpaper()">
            <i class="fas fa-image"></i>
            Change Wallpaper
        </div>
    `;
    
    document.body.appendChild(menu);
    
    const removeMenu = () => {
        menu.remove();
        document.removeEventListener('click', removeMenu);
    };
    
    setTimeout(() => {
        document.addEventListener('click', removeMenu);
    }, 0);
}); 