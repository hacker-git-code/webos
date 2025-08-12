// Window management
let activeWindow = null;
const windows = new Map();
const windowSnapThreshold = 20; // pixels

// Initialize windows
export function initializeWindows() {
    // Listen for app open events
    (window.EventBus || EventBus).subscribe('app:open', ({ name }) => {
        console.log('[window.js] Received app:open for', name);
        openWindow(name);
    });
    
    // Listen for theme changes
    (window.EventBus || EventBus).subscribe('theme:change', ({ isDark }) => {
        updateWindowThemes(isDark);
    });
}

// Attach for debugging
window.openWindow = openWindow;
window.initializeWindows = initializeWindows;

// Open window with animation
let zIndexCounter = 1000;
function openWindow(appName) {
    if (windows.has(appName)) {
        const win = windows.get(appName);
        win.style.zIndex = ++zIndexCounter;
        win.classList.add('active');
        return;
    }
    // App content mapping
    const appContents = {
        'finder': `<h2>Finder</h2><p>Browse your files here.</p>`,
        'notes': `<div id="notes-app" class="notes-app">
            <div class="notes-header">
                <button id="new-note" class="notes-btn">New Note</button>
            </div>
            <div class="notes-list"></div>
            <div class="notes-editor">
                <textarea placeholder="Select or create a note..."></textarea>
            </div>
        </div>`,
        'music': `<h2>Music</h2><div class="music-player"><p>Your music library will appear here.</p><button disabled>Play</button></div>`,
        'calendar': `<h2>Calendar</h2><div class="calendar-app"><p>Events and reminders will show here.</p></div>`,
        'photos': `<h2>Photos</h2><div class="photos-app"><p>Browse and view your photos.</p></div>`,
        'terminal': `<h2>Terminal</h2><div class="terminal-app"><p>Type commands below:</p><input type='text' class='terminal-input' placeholder='echo Hello World'></div>`,
        'settings': `<h2>Settings</h2><div class="settings-app"><p>System preferences and appearance settings.</p></div>`,
        'browser': `<h2>Browser</h2><div class="browser-app"><input type='text' class='browser-bar' placeholder='Enter URL'><iframe class='browser-frame' style='width:100%;height:200px;border:none;'></iframe></div>`,
        'calculator': `<h2>Calculator</h2><div class="calculator-app"><input type='text' class='calc-display' disabled value='0'><div class='calc-buttons'>[0-9, +, -, ×, ÷, =, C]</div></div>`,
        'mail': `<h2>Mail</h2><div class="mail-app"><p>Inbox and compose coming soon.</p></div>`,
        'weather': `<h2>Weather</h2><div class="weather-app"><p>Weather info will display here.</p></div>`,
        'app store': `<h2>App Store</h2><div class="appstore-app"><p>Browse and install apps.</p></div>`,
        'trash': `<h2>Trash</h2><div class="trash-app"><p>Deleted items will be listed here.</p></div>`,
        'files': `<h2>Files</h2><div class="files-app"><p>Manage your files and folders.</p></div>`
    };
    const content = appContents[appName.toLowerCase()] || `<h2>${appName}</h2><p>App coming soon.</p>`;
    const win = createWindow(appName, content);
    win.style.zIndex = ++zIndexCounter;
    win.classList.add('active');
    document.body.appendChild(win);
    windows.set(appName, win);
}

    // Check if window already exists
    if (windows.has(appName)) {
        const window = windows.get(appName);
        if (window.classList.contains('minimized')) {
            window.classList.remove('minimized');
            window.style.animation = 'windowRestore 0.3s ease forwards';
        }
        bringToFront(window);
        return;
    }
    
    // Create new window
    const window = createWindow(appName);
    windows.set(appName, window);
    document.body.appendChild(window);
    
    // Add opening animation
// Create window with enhanced styling
function createWindow(appName, contentHtml) {
    const window = document.createElement('div');
    window.className = 'window';
    window.dataset.app = appName;
    window.style.position = 'absolute';
    window.style.top = '80px';
    window.style.left = '120px';
    window.style.minWidth = '320px';
    window.style.minHeight = '220px';
    window.style.background = 'var(--surface, #222)';
    window.style.borderRadius = '14px';
    window.style.boxShadow = '0 8px 40px 0 rgba(0,0,0,0.18)';
    window.style.overflow = 'hidden';
    window.style.display = 'flex';
    window.style.flexDirection = 'column';

    // Create window header
    const header = document.createElement('div');
    header.className = 'window-header';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '0 12px';
    header.style.height = '36px';
    header.style.background = 'rgba(30,30,40,0.9)';
    header.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    header.style.userSelect = 'none';

    // Mac-style traffic lights
    const controls = document.createElement('div');
    controls.className = 'window-controls';
    controls.style.display = 'flex';
    controls.style.gap = '8px';
    controls.innerHTML = `
        <div class="window-control close" title="Close" style="background:#ff5f56;"></div>
        <div class="window-control minimize" title="Minimize" style="background:#ffbd2e;"></div>
        <div class="window-control maximize" title="Maximize" style="background:#27c93f;"></div>
    `;
    
    // Title
    const title = document.createElement('div');
    title.className = 'window-title';
    title.style.flex = '1';
    title.style.textAlign = 'center';
    title.style.fontWeight = 'bold';
    title.style.color = '#fff';
    title.innerHTML = `<i class="fas ${getAppIcon(appName)}"></i> ${appName}`;

    // Assemble header
    header.appendChild(controls);
    header.appendChild(title);

    // Window content
    const content = document.createElement('div');
    content.className = 'window-content';
    content.style.flex = '1';
    content.style.background = 'var(--surface, #222)';
    content.style.overflow = 'auto';
    content.innerHTML = contentHtml || getAppContent(appName);

    window.appendChild(header);
    window.appendChild(content);

    // Controls logic
    controls.children[0].onclick = () => { window.remove(); windows.delete(appName); };
    controls.children[1].onclick = () => { window.classList.toggle('minimized'); window.style.display = window.classList.contains('minimized') ? 'none' : 'flex'; };
    controls.children[2].onclick = () => { window.classList.toggle('maximized');
        if (window.classList.contains('maximized')) {
            window.style.top = '0'; window.style.left = '0'; window.style.width = '100vw'; window.style.height = '100vh';
        } else {
            window.style.top = '80px'; window.style.left = '120px'; window.style.width = ''; window.style.height = ''; }
    };

    // Dragging
    makeDraggable(window, header);
    addResizeHandles(window);
    return window;
}

// Get app icon
function getAppIcon(appName) {
    const icons = {
        'files': 'folder',
        'browser': 'globe',
        'terminal': 'terminal',
        'settings': 'cog'
    };
    return icons[appName.toLowerCase()] || 'window-maximize';
}

// Get app content
function getAppContent(appName) {
    const content = {
        'files': '<div class="files-app">Files content</div>',
        'browser': '<div class="browser-app">Browser content</div>',
        'terminal': '<div class="terminal-app">Terminal content</div>',
        'settings': '<div class="settings-app">Settings content</div>'
    };
    return content[appName.toLowerCase()] || '<div>App content</div>';
}

// Add window controls with animations
function addWindowControls(window) {
    const controls = window.querySelector('.window-controls');
    
    // Minimize with animation
    controls.querySelector('.minimize').addEventListener('click', () => {
        window.style.animation = 'windowMinimize 0.3s ease forwards';
        setTimeout(() => {
            window.classList.add('minimized');
            window.style.animation = '';
        }, 300);
    });
    
    // Maximize with animation
    controls.querySelector('.maximize').addEventListener('click', () => {
        const isMaximized = window.classList.contains('maximized');
        window.style.animation = isMaximized ? 'windowRestore 0.3s ease forwards' : 'windowMaximize 0.3s ease forwards';
        window.classList.toggle('maximized');
    });
    
    // Close with animation
    controls.querySelector('.close').addEventListener('click', () => {
        window.style.animation = 'windowClose 0.3s ease forwards';
        setTimeout(() => {
            window.remove();
            windows.delete(window.dataset.app);
        }, 300);
    });
}

// Add resize handles
function addResizeHandles(window) {
    const positions = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    
    positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `window-resize-handle ${pos}`;
        window.appendChild(handle);
        
        makeResizable(window, handle, pos);
    });
}

// Make window draggable with snapping
function makeDraggable(window, header) {
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY;
    
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - window.offsetLeft;
        offsetY = e.clientY - window.offsetTop;
        startX = window.offsetLeft;
        startY = window.offsetTop;
        bringToFront(window);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Window snapping
        if (Math.abs(newX) < windowSnapThreshold) newX = 0;
        if (Math.abs(newY) < windowSnapThreshold) newY = 0;
        
        // Screen boundary check
        newX = Math.max(0, Math.min(newX, window.innerWidth - window.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - window.offsetHeight));
        
        window.style.left = `${newX}px`;
        window.style.top = `${newY}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        // Add slight bounce effect
        window.style.transition = 'all 0.2s ease';
        setTimeout(() => {
            window.style.transition = '';
        }, 200);
    });
}

// Make window resizable
function makeResizable(window, handle, position) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = window.offsetWidth;
        startHeight = window.offsetHeight;
        bringToFront(window);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        if (position.includes('e')) {
            window.style.width = `${startWidth + deltaX}px`;
        }
        if (position.includes('w')) {
            window.style.width = `${startWidth - deltaX}px`;
            window.style.left = `${window.offsetLeft + deltaX}px`;
        }
        if (position.includes('s')) {
            window.style.height = `${startHeight + deltaY}px`;
        }
        if (position.includes('n')) {
            window.style.height = `${startHeight - deltaY}px`;
            window.style.top = `${window.offsetTop + deltaY}px`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

// Bring window to front
function bringToFront(window) {
    if (activeWindow) {
        activeWindow.classList.remove('active');
    }
    activeWindow = window;
    window.classList.add('active');
}

// Update window themes
function updateWindowThemes(isDark) {
    windows.forEach(window => {
        window.style.backgroundColor = isDark ? 'var(--surface-dark)' : 'var(--surface-light)';
        window.style.color = isDark ? 'var(--text)' : 'var(--text)';
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes windowOpen {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes windowClose {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
    
    @keyframes windowMinimize {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9) translateY(20px); }
    }
    
    @keyframes windowRestore {
        from { opacity: 0; transform: scale(0.9) translateY(20px); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes windowMaximize {
        from { transform: scale(1); }
        to { transform: scale(1.02); }
    }
`;
document.head.appendChild(style); 