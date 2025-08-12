// Top bar initialization and functionality

export function initializeTopBar() {
    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);
    // Theme toggle
    initializeThemeToggle();
    // System icons
    initializeSystemIcons();
    // Application menu
    initializeAppMenu();
}

// Live clock update
function updateClock() {
    const clock = document.getElementById('clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const body = document.body;
            const isDark = body.classList.contains('dark-theme');
            if (isDark) {
                body.classList.replace('dark-theme', 'light-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.replace('light-theme', 'dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
}

// Close any open panels or menus
function closePanels() {
    document.querySelectorAll('.topbar-panel, .context-menu').forEach(el => el.remove());
}

// Panel and context menu renderer
function showPanel({ id, className = '', content, anchor, width = 300 }) {
    closePanels();
    const panel = document.createElement('div');
    panel.id = id;
    panel.className = `topbar-panel glass ${className}`;
    panel.style.position = 'fixed';
    if (anchor) {
        const rect = anchor.getBoundingClientRect();
        panel.style.left = `${rect.left}px`;
        panel.style.top = `${rect.bottom + 4}px`;
    } else {
        panel.style.left = '50%';
        panel.style.top = '20vh';
        panel.style.transform = 'translateX(-50%)';
    }
    panel.style.width = `${width}px`;
    panel.innerHTML = content;
    document.body.appendChild(panel);
    setTimeout(() => {
        document.addEventListener('click', function clickHandler(e) {
            if (!panel.contains(e.target)) {
                panel.remove();
                document.removeEventListener('click', clickHandler);
            }
        });
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                panel.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }, 0);
}

// Initialize all system icon behaviors
function initializeSystemIcons() {
    // Theme panel hover
    const themeIcon = document.getElementById('theme-toggle');
    if (themeIcon) {
        themeIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            showPanel({
                id: 'theme-panel',
                anchor: themeIcon,
                content: `
                    <div class='panel-header'><span>Theme</span></div>
                    <div class='panel-content'>
                        <div class='menu-item' data-theme='light'>Light Mode</div>
                        <div class='menu-item' data-theme='dark'>Dark Mode</div>
                    </div>
                `
            });
            setTimeout(() => {
                const panel = document.getElementById('theme-panel');
                if (panel) {
                    panel.addEventListener('mouseleave', closePanels);
                    panel.querySelectorAll('.menu-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const newTheme = item.getAttribute('data-theme');
                            const body = document.body;
                            const themeToggleEl = document.getElementById('theme-toggle');
                            if (newTheme === 'dark') {
                                body.classList.replace('light-theme', 'dark-theme');
                            } else {
                                body.classList.replace('dark-theme', 'light-theme');
                            }
                            if (themeToggleEl) {
                                themeToggleEl.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
                            }
                            closePanels();
                            EventBus.publish('theme:change', { isDark: newTheme === 'dark' });
                        });
                    });
                }
            }, 0);
        });
    }

    // Wi-Fi panel
    const wifiIcon = document.getElementById('wifi-icon');
    if (wifiIcon) {
        wifiIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            showPanel({
                id: 'wifi-panel',
                anchor: wifiIcon,
                content: `
                    <div class='panel-header'><span>Wi-Fi Networks</span></div>
                    <div class='panel-content'>
                        <div class='menu-item'><i class='fas fa-wifi'></i> Home Wi-Fi <span style='float:right'>✔</span></div>
                        <div class='menu-item'><i class='fas fa-wifi'></i> Guest Network</div>
                        <div class='menu-item'><i class='fas fa-wifi'></i> CoffeeShop</div>
                        <div class='menu-divider'></div>
                        <div class='menu-item'><i class='fas fa-cog'></i> Wi-Fi Settings</div>
                    </div>
                `
            });
            setTimeout(() => {
                const panel = document.getElementById('wifi-panel');
                if (panel) panel.addEventListener('mouseleave', closePanels);
            }, 0);
        });
    }

    // Battery panel
    const batteryIcon = document.getElementById('battery-icon');
    if (batteryIcon) {
        batteryIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    const level = Math.round(battery.level * 100);
                    const charging = battery.charging;
                    showPanel({
                        id: 'battery-panel',
                        anchor: batteryIcon,
                        content: `
                            <div class='panel-header'><span>Battery</span></div>
                            <div class='panel-content'><p>${level}% ${charging ? '(Charging)' : ''}</p></div>
                        `
                    });
                    setTimeout(() => {
                        const panel = document.getElementById('battery-panel');
                        if (panel) panel.addEventListener('mouseleave', closePanels);
                    }, 0);
                });
            } else {
                showPanel({
                    id: 'battery-panel',
                    anchor: batteryIcon,
                    content: `
                        <div class='panel-header'><span>Battery</span></div>
                        <div class='panel-content'><p>100% (Simulated)</p></div>
                    `
                });
                setTimeout(() => {
                    const panel = document.getElementById('battery-panel');
                    if (panel) panel.addEventListener('mouseleave', closePanels);
                }, 0);
            }
        });
    }

    // Clock details panel
    const clockIcon = document.getElementById('clock');
    if (clockIcon) {
        clockIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            const now = new Date();
            showPanel({
                id: 'clock-panel',
                anchor: clockIcon,
                content: `
                    <div class='panel-header'><span>Current Time</span></div>
                    <div class='panel-content'><p>${now.toLocaleString()}</p></div>
                `
            });
            setTimeout(() => {
                const panel = document.getElementById('clock-panel');
                if (panel) panel.addEventListener('mouseleave', closePanels);
            }, 0);
        });
    }

    // Search panel
    const searchIcon = document.getElementById('search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            showPanel({
                id: 'search-panel',
                anchor: searchIcon,
                content: `
                    <div class='panel-header'><span>Search</span></div>
                    <div class='panel-content'>
                        <input type='text' id='search-input' placeholder='Search apps and files...' class='search-input'/>
                        <div id='search-results'>Type to search...</div>
                    </div>
                `
            });
            setTimeout(() => {
                const input = document.getElementById('search-input');
                const results = document.getElementById('search-results');
                if (input && results) {
                    input.addEventListener('input', () => {
                        const term = input.value.toLowerCase();
                        results.innerHTML = '';
                        const iconSpans = Array.from(document.querySelectorAll('#desktop .desktop-icon span'));
                        iconSpans.filter(span => span.textContent.toLowerCase().includes(term))
                            .forEach(span => {
                                const name = span.textContent;
                                const item = document.createElement('div');
                                item.className = 'menu-item';
                                item.textContent = name;
                                item.addEventListener('click', () => {
                                    EventBus.publish('app:open', { name });
                                    closePanels();
                                });
                                results.appendChild(item);
                            });
                        if (results.childNodes.length === 0) {
                            results.textContent = 'No results';
                        }
                    });
                }
                const panel = document.getElementById('search-panel');
                if (panel) panel.addEventListener('mouseleave', closePanels);
            }, 0);
        });
    }

    // Notifications panel
    const notificationsIcon = document.getElementById('notifications-icon');
    if (notificationsIcon) {
        notificationsIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            showPanel({
                id: 'notifications-panel',
                anchor: notificationsIcon,
                content: `
                    <div class='panel-header'><span>Notifications</span></div>
                    <div class='panel-content'><p>No new notifications.</p></div>
                `
            });
            setTimeout(() => {
                const panel = document.getElementById('notifications-panel');
                if (panel) panel.addEventListener('mouseleave', closePanels);
            }, 0);
        });
    }

    // Volume control panel
    const volumeIcon = document.getElementById('volume-icon');
    if (volumeIcon) {
        volumeIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            showPanel({
                id: 'volume-panel',
                anchor: volumeIcon,
                content: `
                    <div class='panel-header'><span>Volume</span></div>
                    <div class='panel-content'>
                        <input type='range' id='volume-slider' min='0' max='100' value='50'/>
                        <p id='volume-value'>50%</p>
                    </div>
                `
            });
            setTimeout(() => {
                const slider = document.getElementById('volume-slider');
                const val = document.getElementById('volume-value');
                slider && slider.addEventListener('input', () => val.textContent = slider.value + '%');
                const panel = document.getElementById('volume-panel');
                if (panel) panel.addEventListener('mouseleave', closePanels);
            }, 0);
        });
    }

    // User profile panel
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            showPanel({
                id: 'profile-panel',
                anchor: profileIcon,
                content: `
                    <div class='panel-header'><span>User Profile</span></div>
                    <div class='panel-content'>
                        <p>Guest User</p>
                        <div class='menu-divider'></div>
                        <div class='menu-item' id='logout-button'><i class='fas fa-sign-out-alt'></i> Logout</div>
                    </div>
                `
            });
            setTimeout(() => {
                const btn = document.getElementById('logout-button');
                btn && btn.addEventListener('click', () => window.location.href = '/login');
                const panel = document.getElementById('profile-panel');
                if (panel) panel.addEventListener('mouseleave', closePanels);
            }, 0);
        });
    }
}

// Application menu behavior
function initializeAppMenu() {
    const appMenu = document.querySelector('.app-menu');
    const dropdown = document.querySelector('.app-menu-dropdown');
    if (appMenu && dropdown) {
        appMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            closePanels();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => { if (dropdown.style.display === 'block') dropdown.style.display = 'none'; });
        dropdown.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.textContent.trim();
                dropdown.style.display = 'none';
                switch(action) {
                    case 'About WebOS':
                        showPanel({ id: 'about-panel', content: `<div class='modal-header'><span>About WebOS</span><button class='modal-close'>&times;</button></div><div class='modal-content'><p><strong>WebOS</strong> &copy;2025<br>macOS-like WebOS UI<br>v1.0.0</p></div>` });
                        break;
                    case 'Preferences':
                        showPanel({ id: 'preferences-panel', content: `<div class='modal-header'><span>Preferences</span><button class='modal-close'>&times;</button></div><div class='modal-content'><p>Settings window coming soon.</p></div>` });
                        break;
                    case 'App Store':
                        showPanel({ id: 'appstore-panel', content: `<div class='modal-header'><span>App Store</span><button class='modal-close'>&times;</button></div><div class='modal-content'><p>App Store window coming soon.</p></div>` });
                        break;
                    case 'Restart':
                        showPanel({ id: 'restart-panel', content: `<div class='modal-header'><span>Restart</span><button class='modal-close'>&times;</button></div><div class='modal-content'><p>Restart WebOS?</p><button id='restart-confirm'>Restart</button></div>` });
                        setTimeout(() => document.getElementById('restart-confirm').onclick = () => location.reload(), 0);
                        break;
                    case 'Shut Down':
                        showPanel({ id: 'shutdown-panel', content: `<div class='modal-header'><span>Shut Down</span><button class='modal-close'>&times;</button></div><div class='modal-content'><p>Shut down WebOS?</p><button id='shutdown-confirm'>Shut Down</button></div>` });
                        setTimeout(() => document.getElementById('shutdown-confirm').onclick = () => window.location.href = '/login', 0);
                        break;
                }
                setTimeout(() => document.querySelectorAll('.modal-close').forEach(btn => btn.onclick = closePanels), 0);
            });
        });
    }
}