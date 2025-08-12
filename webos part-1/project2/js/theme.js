// Theme management functions

// Initialize theme
export function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateThemeIcon(true);
  }
  
  // Set up theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', toggleTheme);
}

// Toggle between light and dark themes
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Animate icon
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.classList.add('animating');
  setTimeout(() => {
    themeToggle.classList.remove('animating');
  }, 500);
  
  // Update the icon
  updateThemeIcon(isDark);
  
  // Notify other components about theme change
  window.EventBus.publish('themeChanged', { isDark });
}

// Update theme icon based on current theme
function updateThemeIcon(isDark) {
  const themeIcon = document.querySelector('#theme-toggle i');
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Export the theme toggle function for use in other modules
export { toggleTheme };