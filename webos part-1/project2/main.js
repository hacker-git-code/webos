import './style.css';

// Import modules
import { initializeDesktop } from './js/desktop.js';
import { initializeDock } from './js/dock.js';
import { initializeWindows } from './js/window.js';
import { initializeTopBar } from './js/topbar.js';
import { initializeApps } from './js/apps.js';
import { initializeTheme } from './js/theme.js';

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  console.log('NebulaOS is starting...');
  
  // Calculate CSS variables for RGB values (for rgba usage)
  calculateRgbVariables();
  
  // Initialize OS components
  initializeTheme();
  initializeTopBar();
  initializeDesktop();
  initializeDock();
  initializeWindows();
  initializeApps();
  
  console.log('NebulaOS initialized successfully');
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