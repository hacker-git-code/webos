// Import modules
import { initializeDesktop } from './desktop.js';
import { initializeDock } from './dock.js';
import { initializeWindows } from './window.js';
import { initializeTopBar } from './topbar.js';
import { initializeApps } from './apps.js';
import { initializeTheme } from './theme.js';

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    console.log('WebOS is starting...');
    
    // Calculate CSS variables for RGB values (for rgba usage)
    calculateRgbVariables();
    
    // Initialize OS components
    initializeTheme();
    initializeTopBar();
    initializeDesktop();
    initializeDock();
    initializeWindows();
    initializeApps();
    
    console.log('WebOS initialized successfully');
});

// Helper to calculate RGB values from HEX for CSS variables
function calculateRgbVariables() {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    // Function to convert hex to rgb
    const hexToRgb = (hex) => {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return [r, g, b].join(', ');
    };
    
    // Convert colors to RGB
    const colors = [
        'primary', 'primary-light', 'primary-dark',
        'accent', 'accent-light', 'accent-dark',
        'warning', 'error', 'success',
        'bg-light', 'surface-light', 'bg-dark', 'surface-dark',
        'background', 'surface'
    ];
    
    colors.forEach(color => {
        const hexValue = style.getPropertyValue(`--${color}`).trim();
        if (hexValue && hexValue.startsWith('#')) {
            const rgbValue = hexToRgb(hexValue);
            root.style.setProperty(`--${color}-rgb`, rgbValue);
        }
    });
}

// Global event bus for inter-component communication
window.EventBus = {
    events: {},
    
    // Subscribe to an event
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    },
    
    // Publish an event
    publish(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
};

// Prevent context menu on right click (we'll handle this ourselves)
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking login status...');
    checkLoginStatus();
});

// Function to check login status
async function checkLoginStatus() {
    try {
        const response = await fetch('/api/check-login');
        const data = await response.json();
        console.log('Login status:', data);
        
        if (data.logged_in) {
            hideLoginScreen();
        } else {
            showLoginScreen();
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        showLoginScreen();
    }
}

// DEBUG: main.js loaded
console.log('main.js loaded!');

// Function to handle login form submission
console.log('Attaching login-form submit handler...');
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login form submitted (handler running)');
    
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        
        if (data.status === 'success') {
            console.log('Login successful, redirecting to desktop...');
            window.location.href = '/desktop';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
});

// Function to show login screen
function showLoginScreen() {
    console.log('Showing login screen...');
    const loginScreen = document.getElementById('login-screen');
    const desktop = document.getElementById('desktop');
    const menuBar = document.querySelector('.menu-bar');
    const dock = document.querySelector('.dock');
    
    loginScreen.style.display = 'flex';
    desktop.style.display = 'none';
    menuBar.style.display = 'none';
    dock.style.display = 'none';
    
    console.log('Login screen elements:', {
        loginScreen: loginScreen.style.display,
        desktop: desktop.style.display,
        menuBar: menuBar.style.display,
        dock: dock.style.display
    });
}

// Function to hide login screen
function hideLoginScreen() {
    console.log('Hiding login screen...');
    const loginScreen = document.getElementById('login-screen');
    const desktop = document.getElementById('desktop');
    const menuBar = document.querySelector('.menu-bar');
    const dock = document.querySelector('.dock');
    
    loginScreen.style.display = 'none';
    desktop.style.display = 'block';
    menuBar.style.display = 'flex';
    dock.style.display = 'flex';
    
    console.log('Desktop elements:', {
        loginScreen: loginScreen.style.display,
        desktop: desktop.style.display,
        menuBar: menuBar.style.display,
        dock: dock.style.display
    });
}

// Update time in menu bar
function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeElement.textContent = timeString;
}

// Update time every minute
setInterval(updateTime, 60000);
updateTime(); // Initial update

// Handle dock item clicks
document.querySelectorAll('.dock-item').forEach(item => {
    item.addEventListener('click', () => {
        const app = item.getAttribute('data-app');
        console.log(`Opening ${app}...`);
        // Add app opening logic here
    });
});

// Handle file upload button
document.getElementById('upload-btn').addEventListener('click', () => {
    console.log('Upload button clicked');
    // Add file upload logic here
}); 