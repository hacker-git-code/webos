// App management
const apps = {
    files: {
        name: 'Files',
        icon: 'fa-folder',
        content: `
            <div class="files-app">
                <div class="files-header">
                    <div class="files-toolbar">
                        <button class="files-button">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="files-button">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="files-button">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <div class="files-path">/</div>
                    </div>
                </div>
                <div class="files-content">
                    <div class="files-grid">
                        <div class="files-item">
                            <i class="fas fa-folder"></i>
                            <span>Documents</span>
                        </div>
                        <div class="files-item">
                            <i class="fas fa-folder"></i>
                            <span>Downloads</span>
                        </div>
                        <div class="files-item">
                            <i class="fas fa-folder"></i>
                            <span>Pictures</span>
                        </div>
                        <div class="files-item">
                            <i class="fas fa-folder"></i>
                            <span>Music</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    browser: {
        name: 'Browser',
        icon: 'fa-globe',
        content: `
            <div class="browser-app">
                <div class="browser-header">
                    <div class="browser-toolbar">
                        <button class="browser-button">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="browser-button">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="browser-button">
                            <i class="fas fa-redo"></i>
                        </button>
                        <input type="text" class="browser-url" placeholder="Enter URL">
                        <button class="browser-button">
                            <i class="fas fa-home"></i>
                        </button>
                    </div>
                </div>
                <div class="browser-content">
                    <iframe src="about:blank" class="browser-frame"></iframe>
                </div>
            </div>
        `
    },
    terminal: {
        name: 'Terminal',
        icon: 'fa-terminal',
        content: `
            <div class="terminal-app">
                <div class="terminal-header">
                    <div class="terminal-toolbar">
                        <span class="terminal-title">Terminal</span>
                    </div>
                </div>
                <div class="terminal-content">
                    <div class="terminal-output">
                        <div class="terminal-line">
                            <span class="terminal-prompt">$</span>
                            <span class="terminal-input"></span>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    settings: {
        name: 'Settings',
        icon: 'fa-cog',
        content: `
            <div class="settings-app">
                <div class="settings-header">
                    <div class="settings-toolbar">
                        <span class="settings-title">Settings</span>
                    </div>
                </div>
                <div class="settings-content">
                    <div class="settings-section">
                        <h3>Appearance</h3>
                        <div class="settings-option">
                            <label>Theme</label>
                            <select class="settings-select">
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>System</h3>
                        <div class="settings-option">
                            <label>Language</label>
                            <select class="settings-select">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    notes: {
        name: 'Notes',
        icon: 'fa-sticky-note',
        content: `
            <div id="notes-app" class="notes-app">
                <div class="notes-header">
                    <button id="new-note" class="notes-btn">New Note</button>
                </div>
                <div class="notes-list"></div>
                <div class="notes-editor">
                    <textarea placeholder="Select or create a note..."></textarea>
                </div>
            </div>
        `
    }
};

// Initialize apps
export function initializeApps() {
    // Listen for app open events
    EventBus.subscribe('app:open', ({ name }) => {
        const app = apps[name.toLowerCase()];
        if (app) {
            // Publish app content event
            EventBus.publish('app:content', {
                name: app.name,
                icon: app.icon,
                content: app.content
            });
        }
    });
    
    // Listen for theme changes
    EventBus.subscribe('theme:change', ({ isDark }) => {
        // Update app themes
        document.querySelectorAll('.window').forEach(window => {
            window.style.backgroundColor = isDark ? 'var(--surface-dark)' : 'var(--surface-light)';
        });
    });
}

// Get app content
export function getAppContent(appName) {
    const app = apps[appName.toLowerCase()];
    return app ? app.content : '<div>App not found</div>';
}

// Get app icon
export function getAppIcon(appName) {
    const app = apps[appName.toLowerCase()];
    return app ? app.icon : 'fa-window-maximize';
} 