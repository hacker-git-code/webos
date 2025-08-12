// Theme management
export function initializeTheme() {
    // Set initial theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(e.matches ? 'dark-theme' : 'light-theme');
    });
    
    // Listen for theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-theme');
            document.body.classList.remove('dark-theme', 'light-theme');
            document.body.classList.add(isDark ? 'light-theme' : 'dark-theme');
            
            // Update theme toggle icon
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            // Publish theme change event
            EventBus.publish('theme:change', { isDark: !isDark });
        });
    }
}

// Get current theme
export function getCurrentTheme() {
    return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
}

// Set theme
export function setTheme(theme) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
    
    // Publish theme change event
    EventBus.publish('theme:change', { isDark: theme === 'dark' });
} 