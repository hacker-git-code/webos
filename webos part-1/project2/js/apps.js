// Apps management

// Register app handlers
export function initializeApps() {
  // Listen for app-specific events
  window.EventBus.subscribe('toggleTheme', toggleTheme);
}

// Toggle theme (coming from settings app)
function toggleTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.click();
  }
}

// App definitions
export const apps = {
  notes: {
    name: 'Notes',
    icon: 'fa-sticky-note',
    defaultSize: { width: 400, height: 500 }
  },
  calculator: {
    name: 'Calculator',
    icon: 'fa-calculator',
    defaultSize: { width: 300, height: 400 }
  },
  settings: {
    name: 'Settings',
    icon: 'fa-cog',
    defaultSize: { width: 600, height: 400 }
  },
  browser: {
    name: 'Browser',
    icon: 'fa-globe',
    defaultSize: { width: 800, height: 600 }
  },
  mail: {
    name: 'Mail',
    icon: 'fa-envelope',
    defaultSize: { width: 700, height: 500 }
  },
  calendar: {
    name: 'Calendar',
    icon: 'fa-calendar-alt',
    defaultSize: { width: 700, height: 500 }
  },
  finder: {
    name: 'Finder',
    icon: 'fa-folder',
    defaultSize: { width: 800, height: 500 }
  },
  photos: {
    name: 'Photos',
    icon: 'fa-images',
    defaultSize: { width: 800, height: 600 }
  }
};