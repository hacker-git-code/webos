// Socket.IO connection
const socket = io();

// DOM Elements
const desktop = document.getElementById('desktop');
const appLauncher = document.getElementById('app-launcher');
const loginScreen = document.getElementById('login-screen');
const timeElement = document.getElementById('time');
const uploadBtn = document.getElementById('upload-btn');
const googleLoginBtn = document.getElementById('google-login');
const loginForm = document.getElementById('login-form');

// Authentication state
let isAuthenticated = false;
let authToken = null;

// Application instances
const apps = {
    finder: null,
    textEditor: null,
    calculator: null,
    calendar: null,
    notes: null,
    terminal: null,
    settings: null
};

// Initialize the OS
function initOS() {
    updateTime();
    setInterval(updateTime, 1000);
    setupEventListeners();
    checkAuthentication();
    setupSocketListeners();
}

// Update time display
function updateTime() {
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Setup event listeners
function setupEventListeners() {
    // Dock item clicks
    document.querySelectorAll('.dock-item').forEach(item => {
        item.addEventListener('click', () => {
            const app = item.dataset.app;
            launchApp(app);
        });
    });

    // File upload
    uploadBtn.addEventListener('click', handleFileUpload);

    // Google login
    googleLoginBtn.addEventListener('click', handleGoogleLogin);

    // Form login
    loginForm.addEventListener('submit', handleFormLogin);

    // App launcher toggle
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            appLauncher.style.display = 'none';
        }
    });
}

// Setup Socket.IO listeners
function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('notification', (data) => {
        showNotification(data);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
}

// Handle Google login
async function handleGoogleLogin() {
    try {
        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            authToken = data.token;
            isAuthenticated = true;
            loginScreen.style.display = 'none';
            socket.emit('authenticate', { token: authToken });
        }
    } catch (error) {
        console.error('Google login failed:', error);
    }
}

// Handle form login
async function handleFormLogin(e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            authToken = data.token;
            isAuthenticated = true;
            loginScreen.style.display = 'none';
            socket.emit('authenticate', { token: authToken });
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
}

// Launch application
function launchApp(appName) {
    if (!isAuthenticated) {
        showNotification({ message: 'Please login first' });
        return;
    }

    // Create window
    const window = createWindow(appName);
    
    // Initialize application
    switch (appName) {
        case 'finder':
            if (!apps.finder) {
                apps.finder = new Finder();
                apps.finder.init();
            }
            break;
            
        case 'text-editor':
            if (!apps.textEditor) {
                apps.textEditor = new TextEditor();
                apps.textEditor.init();
            }
            break;
            
        case 'calculator':
            if (!apps.calculator) {
                apps.calculator = new Calculator();
                apps.calculator.init();
            }
            break;
            
        case 'calendar':
            if (!apps.calendar) {
                apps.calendar = new Calendar();
                apps.calendar.init();
            }
            break;
            
        case 'notes':
            if (!apps.notes) {
                apps.notes = new Notes();
                apps.notes.init();
            }
            break;
            
        case 'terminal':
            if (!apps.terminal) {
                apps.terminal = new Terminal();
                apps.terminal.init();
            }
            break;
            
        case 'settings':
            if (!apps.settings) {
                apps.settings = new Settings();
                apps.settings.init();
            }
            break;
    }
}

// Create window
function createWindow(appName) {
    const window = document.createElement('div');
    window.className = 'window';
    window.style.left = '100px';
    window.style.top = '100px';
    
    const header = document.createElement('div');
    header.className = 'window-header';
    
    const controls = document.createElement('div');
    controls.className = 'window-controls';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'window-control window-close';
    closeBtn.addEventListener('click', () => window.remove());
    
    const minimizeBtn = document.createElement('div');
    minimizeBtn.className = 'window-control window-minimize';
    
    const maximizeBtn = document.createElement('div');
    maximizeBtn.className = 'window-control window-maximize';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'window-title';
    titleElement.textContent = appName.replace('-', ' ');
    
    const content = document.createElement('div');
    content.className = 'window-content';
    content.id = `${appName}-content`;
    
    controls.appendChild(closeBtn);
    controls.appendChild(minimizeBtn);
    controls.appendChild(maximizeBtn);
    
    header.appendChild(titleElement);
    header.appendChild(controls);
    
    window.appendChild(header);
    window.appendChild(content);
    
    desktop.appendChild(window);
    
    // Make window draggable
    makeDraggable(window, header);
    
    return window;
}

// Make element draggable
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Handle file upload
async function handleFileUpload() {
    if (!isAuthenticated) {
        showNotification({ message: 'Please login first' });
        return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('file', file);
        });

        try {
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            const data = await response.json();
            if (data.status === 'success') {
                showNotification({ message: 'Files uploaded successfully' });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            showNotification({ message: 'Upload failed' });
        }
    };
    
    input.click();
}

// Show notification
function showNotification(data) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = data.message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check authentication
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        isAuthenticated = true;
        loginScreen.style.display = 'none';
        socket.emit('authenticate', { token });
    } else {
        loginScreen.style.display = 'flex';
    }
}

// Initialize the OS when the page loads
document.addEventListener('DOMContentLoaded', initOS);