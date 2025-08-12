// Dock configuration
const dockApps = [
    {
        name: 'Files',
        icon: 'fa-folder',
        action: () => openApp('files')
    },
    {
        name: 'Browser',
        icon: 'fa-globe',
        action: () => openApp('browser')
    },
    {
        name: 'Terminal',
        icon: 'fa-terminal',
        action: () => openApp('terminal')
    },
    {
        name: 'Settings',
        icon: 'fa-cog',
        action: () => openApp('settings')
    }
];

// Initialize dock
export function initializeDock() {
    const dock = document.getElementById('dock');
    
    // Add separator
    const separator = document.createElement('div');
    separator.className = 'dock-separator';
    dock.appendChild(separator);
    
    // Create dock items
    dockApps.forEach(app => {
        const item = createDockItem(app);
        dock.appendChild(item);
    });
}

// Create dock item
function createDockItem(app) {
    const item = document.createElement('div');
    item.className = 'dock-item';
    item.innerHTML = `<i class="fas ${app.icon}"></i>`;
    item.title = app.name;
    
    item.addEventListener('click', () => {
        // Remove active class from all items
        document.querySelectorAll('.dock-item').forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        // Execute app action
        app.action();
    });
    
    return item;
}

// Open application
function openApp(appName) {
    EventBus.publish('app:open', { name: appName });
}

// Handle dock item hover effect
document.getElementById('dock').addEventListener('mouseover', (e) => {
    const item = e.target.closest('.dock-item');
    if (item) {
        item.style.transform = 'scale(1.2)';
    }
});

document.getElementById('dock').addEventListener('mouseout', (e) => {
    const item = e.target.closest('.dock-item');
    if (item) {
        item.style.transform = 'scale(1)';
    }
}); 