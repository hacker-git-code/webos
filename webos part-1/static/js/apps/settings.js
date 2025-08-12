class Settings {
    constructor() {
        this.settings = {
            appearance: {
                theme: 'light',
                wallpaper: 'default',
                fontSize: 'medium'
            },
            notifications: {
                enabled: true,
                sound: true
            },
            privacy: {
                location: false,
                camera: false,
                microphone: false
            }
        };
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
        this.loadSettings();
    }

    setupUI() {
        const content = document.getElementById('settings-content');
        content.innerHTML = `
            <div class="settings-sidebar">
                <div class="sidebar-item active" data-section="appearance">
                    <i class="fas fa-palette"></i>
                    <span>Appearance</span>
                </div>
                <div class="sidebar-item" data-section="notifications">
                    <i class="fas fa-bell"></i>
                    <span>Notifications</span>
                </div>
                <div class="sidebar-item" data-section="privacy">
                    <i class="fas fa-shield-alt"></i>
                    <span>Privacy</span>
                </div>
                <div class="sidebar-item" data-section="about">
                    <i class="fas fa-info-circle"></i>
                    <span>About</span>
                </div>
            </div>
            <div class="settings-content">
                <div class="settings-section" id="appearance-section">
                    <h2>Appearance</h2>
                    <div class="setting-group">
                        <label>Theme</label>
                        <select class="theme-select">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>Wallpaper</label>
                        <div class="wallpaper-grid">
                            <div class="wallpaper-item" data-wallpaper="default">
                                <img src="/assets/wallpapers/default.jpg" alt="Default">
                            </div>
                            <div class="wallpaper-item" data-wallpaper="nature">
                                <img src="/assets/wallpapers/nature.jpg" alt="Nature">
                            </div>
                            <div class="wallpaper-item" data-wallpaper="abstract">
                                <img src="/assets/wallpapers/abstract.jpg" alt="Abstract">
                            </div>
                        </div>
                    </div>
                    <div class="setting-group">
                        <label>Font Size</label>
                        <select class="font-size-select">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-section" id="notifications-section">
                    <h2>Notifications</h2>
                    <div class="setting-group">
                        <label>Enable Notifications</label>
                        <label class="switch">
                            <input type="checkbox" class="notifications-toggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-group">
                        <label>Notification Sound</label>
                        <label class="switch">
                            <input type="checkbox" class="sound-toggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="settings-section" id="privacy-section">
                    <h2>Privacy</h2>
                    <div class="setting-group">
                        <label>Location Access</label>
                        <label class="switch">
                            <input type="checkbox" class="location-toggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-group">
                        <label>Camera Access</label>
                        <label class="switch">
                            <input type="checkbox" class="camera-toggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-group">
                        <label>Microphone Access</label>
                        <label class="switch">
                            <input type="checkbox" class="microphone-toggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="settings-section" id="about-section">
                    <h2>About WebOS</h2>
                    <div class="about-content">
                        <div class="about-logo">
                            <img src="/assets/logo.png" alt="WebOS Logo">
                        </div>
                        <div class="about-info">
                            <h3>WebOS</h3>
                            <p>Version 1.0.0</p>
                            <p>© 2024 WebOS Team</p>
                            <p>A modern web-based operating system</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const content = document.getElementById('settings-content');
        
        // Sidebar navigation
        content.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                this.showSection(item.dataset.section);
            });
        });

        // Theme selection
        const themeSelect = content.querySelector('.theme-select');
        themeSelect.addEventListener('change', () => {
            this.settings.appearance.theme = themeSelect.value;
            this.applyTheme();
            this.saveSettings();
        });

        // Wallpaper selection
        content.querySelectorAll('.wallpaper-item').forEach(item => {
            item.addEventListener('click', () => {
                this.settings.appearance.wallpaper = item.dataset.wallpaper;
                this.applyWallpaper();
                this.saveSettings();
            });
        });

        // Font size selection
        const fontSizeSelect = content.querySelector('.font-size-select');
        fontSizeSelect.addEventListener('change', () => {
            this.settings.appearance.fontSize = fontSizeSelect.value;
            this.applyFontSize();
            this.saveSettings();
        });

        // Notification toggles
        const notificationsToggle = content.querySelector('.notifications-toggle');
        notificationsToggle.addEventListener('change', () => {
            this.settings.notifications.enabled = notificationsToggle.checked;
            this.saveSettings();
        });

        const soundToggle = content.querySelector('.sound-toggle');
        soundToggle.addEventListener('change', () => {
            this.settings.notifications.sound = soundToggle.checked;
            this.saveSettings();
        });

        // Privacy toggles
        const locationToggle = content.querySelector('.location-toggle');
        locationToggle.addEventListener('change', () => {
            this.settings.privacy.location = locationToggle.checked;
            this.saveSettings();
        });

        const cameraToggle = content.querySelector('.camera-toggle');
        cameraToggle.addEventListener('change', () => {
            this.settings.privacy.camera = cameraToggle.checked;
            this.saveSettings();
        });

        const microphoneToggle = content.querySelector('.microphone-toggle');
        microphoneToggle.addEventListener('change', () => {
            this.settings.privacy.microphone = microphoneToggle.checked;
            this.saveSettings();
        });
    }

    showSection(section) {
        // Update sidebar
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Show section content
        document.querySelectorAll('.settings-section').forEach(sectionElement => {
            sectionElement.style.display = 'none';
        });
        document.getElementById(`${section}-section`).style.display = 'block';
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/settings', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            this.settings = data;
            this.applySettings();
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async saveSettings() {
        try {
            await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.settings)
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    applySettings() {
        this.applyTheme();
        this.applyWallpaper();
        this.applyFontSize();
        
        // Update UI elements
        const content = document.getElementById('settings-content');
        
        // Theme
        content.querySelector('.theme-select').value = this.settings.appearance.theme;
        
        // Wallpaper
        content.querySelectorAll('.wallpaper-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.wallpaper === this.settings.appearance.wallpaper) {
                item.classList.add('active');
            }
        });
        
        // Font size
        content.querySelector('.font-size-select').value = this.settings.appearance.fontSize;
        
        // Notifications
        content.querySelector('.notifications-toggle').checked = this.settings.notifications.enabled;
        content.querySelector('.sound-toggle').checked = this.settings.notifications.sound;
        
        // Privacy
        content.querySelector('.location-toggle').checked = this.settings.privacy.location;
        content.querySelector('.camera-toggle').checked = this.settings.privacy.camera;
        content.querySelector('.microphone-toggle').checked = this.settings.privacy.microphone;
    }

    applyTheme() {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${this.settings.appearance.theme}-theme`);
    }

    applyWallpaper() {
        document.querySelector('.desktop').style.backgroundImage = 
            `url(/assets/wallpapers/${this.settings.appearance.wallpaper}.jpg)`;
    }

    applyFontSize() {
        document.body.style.fontSize = {
            'small': '12px',
            'medium': '14px',
            'large': '16px'
        }[this.settings.appearance.fontSize];
    }
}

// Initialize Settings when the app is launched
function initSettings() {
    const settings = new Settings();
    settings.init();
}