// Window management

// Track windows and z-index
let windows = [];
let highestZIndex = 100;
let activeWindowId = null;

// Initialize window management
export function initializeWindows() {
  // Set up event listeners
  window.EventBus.subscribe('openApp', handleOpenApp);
  window.EventBus.subscribe('openFolder', handleOpenFolder);
}

// Handle opening an app (create window)
function handleOpenApp({ app, options = {} }) {
  // Check if app is already open
  const existingWindow = windows.find(w => w.app === app);
  if (existingWindow) {
    // Bring to front
    focusWindow(existingWindow.id);
    return;
  }
  
  // Create new window
  createWindow(app, options);
}

// Handle opening a folder
function handleOpenFolder({ folder, options = {} }) {
  createFolderWindow(folder, options);
}

// Create a new window
function createWindow(app, options = {}) {
  const windowId = `window-${Date.now()}`;
  
  // Create window element
  const windowEl = document.createElement('div');
  windowEl.className = 'window';
  windowEl.id = windowId;
  windowEl.dataset.app = app;
  
  // Set initial position and size
  const width = options.width || 600;
  const height = options.height || 400;
  
  // Center the window if position not specified
  const left = options.left || (window.innerWidth - width) / 2;
  const top = options.top || (window.innerHeight - height) / 2;
  
  windowEl.style.width = `${width}px`;
  windowEl.style.height = `${height}px`;
  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
  
  // Create window content
  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-controls">
        <div class="window-close"></div>
        <div class="window-minimize"></div>
        <div class="window-maximize"></div>
      </div>
      <div class="window-title">${getAppTitle(app)}</div>
    </div>
    <div class="window-content">
      ${getAppContent(app, options)}
    </div>
  `;
  
  // Add resize handles
  addResizeHandles(windowEl);
  
  // Track the window
  windows.push({
    id: windowId,
    app,
    element: windowEl
  });
  
  // Add to DOM
  document.body.appendChild(windowEl);
  
  // Set up event listeners
  setupWindowEvents(windowEl);
  
  // Show the window with animation
  setTimeout(() => {
    windowEl.classList.add('visible');
  }, 10);
  
  // Focus the window
  focusWindow(windowId);
  
  // Notify that app is opened
  window.EventBus.publish('appOpened', { app });
  
  return windowId;
}

// Create a folder window
function createFolderWindow(folder, options = {}) {
  // Default folder window options
  const folderOptions = {
    width: 700,
    height: 500,
    ...options,
    folder
  };
  
  return createWindow('folder', folderOptions);
}

// Get title for an app window
function getAppTitle(app) {
  const titles = {
    notes: 'Notes',
    calculator: 'Calculator',
    settings: 'Settings',
    folder: options => `${getFolderName(options.folder)}`,
    browser: 'Web Browser',
    mail: 'Mail',
    calendar: 'Calendar',
    photos: 'Photos',
    finder: 'Finder',
    about: 'About NebulaOS',
    appstore: 'App Store'
  };
  
  const title = titles[app];
  if (typeof title === 'function') {
    return title(options);
  }
  return title || 'Application';
}

// Get folder name
function getFolderName(folderId) {
  const folderNames = {
    documents: 'Documents',
    pictures: 'Pictures',
    music: 'Music',
    downloads: 'Downloads'
  };
  
  return folderNames[folderId] || 'Folder';
}

// Get content for an app window
function getAppContent(app, options = {}) {
  switch (app) {
    case 'notes':
      return `<textarea placeholder="Write your notes here..."></textarea>`;
    
    case 'calculator':
      return `
        <div class="calculator-display">0</div>
        <div class="calculator-buttons">
          <div class="calculator-button">C</div>
          <div class="calculator-button">±</div>
          <div class="calculator-button">%</div>
          <div class="calculator-button operator">÷</div>
          
          <div class="calculator-button">7</div>
          <div class="calculator-button">8</div>
          <div class="calculator-button">9</div>
          <div class="calculator-button operator">×</div>
          
          <div class="calculator-button">4</div>
          <div class="calculator-button">5</div>
          <div class="calculator-button">6</div>
          <div class="calculator-button operator">-</div>
          
          <div class="calculator-button">1</div>
          <div class="calculator-button">2</div>
          <div class="calculator-button">3</div>
          <div class="calculator-button operator">+</div>
          
          <div class="calculator-button" style="grid-column: span 2;">0</div>
          <div class="calculator-button">.</div>
          <div class="calculator-button operator">=</div>
        </div>
      `;
    
    case 'settings':
      return `
        <div style="padding: 20px;">
          <h2>Settings</h2>
          <div style="margin-top: 20px;">
            <h3>Appearance</h3>
            <div style="margin-top: 10px;">
              <label style="display: block; margin-bottom: 10px;">
                <input type="checkbox" id="dark-mode-toggle"> Dark Mode
              </label>
            </div>
          </div>
        </div>
      `;
    
    case 'folder':
      return getFolderContent(options.folder);
    
    case 'about':
      return `
        <div style="padding: 20px; text-align: center;">
          <h2>NebulaOS</h2>
          <p style="margin-top: 10px;">Version 1.0</p>
          <p style="margin-top: 20px;">A web-based operating system with modern design.</p>
        </div>
      `;
    
    default:
      return `<div style="padding: 20px;">This app is under development.</div>`;
  }
}

// Get folder content
function getFolderContent(folderId) {
  // Simulated folder contents
  const folderContents = {
    documents: [
      { name: 'Resume.docx', icon: 'fa-file-word' },
      { name: 'Budget.xlsx', icon: 'fa-file-excel' },
      { name: 'Notes.txt', icon: 'fa-file-alt' }
    ],
    pictures: [
      { name: 'Vacation.jpg', icon: 'fa-file-image' },
      { name: 'Family.png', icon: 'fa-file-image' },
      { name: 'Screenshot.png', icon: 'fa-file-image' }
    ],
    music: [
      { name: 'Playlist.mp3', icon: 'fa-file-audio' },
      { name: 'Favorite Song.mp3', icon: 'fa-file-audio' }
    ],
    downloads: [
      { name: 'Installation.dmg', icon: 'fa-file-download' },
      { name: 'Document.pdf', icon: 'fa-file-pdf' }
    ]
  };
  
  const files = folderContents[folderId] || [];
  
  // Generate folder view HTML
  let html = `
    <div style="padding: 10px;">
      <div style="display: flex; align-items: center; padding-bottom: 10px; border-bottom: 1px solid var(--border);">
        <div style="margin-right: 10px;">
          <i class="fas fa-arrow-left" style="cursor: pointer;"></i>
          <i class="fas fa-arrow-right" style="margin-left: 10px; cursor: pointer;"></i>
        </div>
        <div style="flex: 1; padding: 5px; border-radius: 4px; background-color: rgba(var(--background-rgb), 0.2);">
          ${getFolderName(folderId)}
        </div>
      </div>
      
      <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px;">
  `;
  
  // Add files to the folder view
  files.forEach(file => {
    html += `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
          <i class="fas ${file.icon}" style="font-size: 36px; color: var(--primary);"></i>
        </div>
        <div style="margin-top: 5px; text-align: center; font-size: 12px; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${file.name}
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}

// Set up window events (drag, focus, close)
function setupWindowEvents(windowEl) {
  const titlebar = windowEl.querySelector('.window-titlebar');
  const closeBtn = windowEl.querySelector('.window-close');
  const minimizeBtn = windowEl.querySelector('.window-minimize');
  const maximizeBtn = windowEl.querySelector('.window-maximize');
  
  // Focus window when clicked
  windowEl.addEventListener('mousedown', () => {
    focusWindow(windowEl.id);
  });
  
  // Make window draggable by titlebar
  makeDraggable(windowEl, titlebar);
  
  // Close button
  closeBtn.addEventListener('click', () => {
    closeWindow(windowEl.id);
  });
  
  // Minimize button
  minimizeBtn.addEventListener('click', () => {
    minimizeWindow(windowEl.id);
  });
  
  // Maximize button
  maximizeBtn.addEventListener('click', () => {
    toggleMaximizeWindow(windowEl.id);
  });
  
  // Special app-specific handlers
  setupAppSpecificHandlers(windowEl);
}

// Set up app-specific event handlers
function setupAppSpecificHandlers(windowEl) {
  const app = windowEl.dataset.app;
  
  if (app === 'settings') {
    // Dark mode toggle in settings
    const darkModeToggle = windowEl.querySelector('#dark-mode-toggle');
    if (darkModeToggle) {
      // Set initial state
      darkModeToggle.checked = document.body.classList.contains('dark-theme');
      
      // Handle changes
      darkModeToggle.addEventListener('change', () => {
        // This will toggle dark mode and update the UI
        window.EventBus.publish('toggleTheme');
      });
    }
  } else if (app === 'calculator') {
    setupCalculator(windowEl);
  }
}

// Set up calculator functionality
function setupCalculator(windowEl) {
  const display = windowEl.querySelector('.calculator-display');
  const buttons = windowEl.querySelectorAll('.calculator-button');
  
  let currentValue = '0';
  let previousValue = '';
  let operation = null;
  let resetDisplay = false;
  
  // Update display
  const updateDisplay = () => {
    display.textContent = currentValue;
  };
  
  // Handle button clicks
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.textContent;
      
      if (value === 'C') {
        // Clear
        currentValue = '0';
        previousValue = '';
        operation = null;
      } else if (value === '±') {
        // Toggle sign
        currentValue = (parseFloat(currentValue) * -1).toString();
      } else if (value === '%') {
        // Percentage
        currentValue = (parseFloat(currentValue) / 100).toString();
      } else if ('+-×÷'.includes(value)) {
        // Operation
        previousValue = currentValue;
        operation = value;
        resetDisplay = true;
      } else if (value === '=') {
        // Calculate
        if (previousValue && operation) {
          const prev = parseFloat(previousValue);
          const current = parseFloat(currentValue);
          
          switch (operation) {
            case '+':
              currentValue = (prev + current).toString();
              break;
            case '-':
              currentValue = (prev - current).toString();
              break;
            case '×':
              currentValue = (prev * current).toString();
              break;
            case '÷':
              currentValue = (prev / current).toString();
              break;
          }
          
          previousValue = '';
          operation = null;
        }
      } else if (value === '.') {
        // Decimal point
        if (!currentValue.includes('.')) {
          currentValue += '.';
        }
      } else {
        // Number
        if (currentValue === '0' || resetDisplay) {
          currentValue = value;
          resetDisplay = false;
        } else {
          currentValue += value;
        }
      }
      
      updateDisplay();
    });
  });
}

// Make an element draggable
function makeDraggable(element, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  handle.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e.preventDefault();
    // Get mouse position
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // Focus window
    focusWindow(element.id);
    
    // Add dragging class
    element.classList.add('dragging');
    
    // Add event listeners
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e.preventDefault();
    // Calculate new position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // Set element's new position
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }
  
  function closeDragElement() {
    // Remove event listeners
    document.onmouseup = null;
    document.onmousemove = null;
    
    // Remove dragging class
    element.classList.remove('dragging');
  }
}

// Add resize handles to window
function addResizeHandles(windowEl) {
  const directions = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
  
  directions.forEach(dir => {
    const handle = document.createElement('div');
    handle.className = `resize-handle ${dir}`;
    windowEl.appendChild(handle);
    
    makeResizable(windowEl, handle, dir);
  });
}

// Make window resizable
function makeResizable(element, handle, direction) {
  handle.onmousedown = resizeMouseDown;
  
  function resizeMouseDown(e) {
    e.preventDefault();
    
    // Focus window
    focusWindow(element.id);
    
    // Add resizing class
    element.classList.add('resizing');
    
    // Start position
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Original dimensions
    const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
    const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
    
    // Original position
    const startLeft = element.offsetLeft;
    const startTop = element.offsetTop;
    
    // Add event listeners
    document.onmouseup = stopResize;
    document.onmousemove = resize;
    
    function resize(e) {
      // Calculate new size and position
      if (direction.includes('e')) {
        const width = startWidth + (e.clientX - startX);
        if (width > 200) element.style.width = width + 'px';
      }
      
      if (direction.includes('s')) {
        const height = startHeight + (e.clientY - startY);
        if (height > 100) element.style.height = height + 'px';
      }
      
      if (direction.includes('w')) {
        const width = startWidth - (e.clientX - startX);
        if (width > 200) {
          element.style.width = width + 'px';
          element.style.left = startLeft + (e.clientX - startX) + 'px';
        }
      }
      
      if (direction.includes('n')) {
        const height = startHeight - (e.clientY - startY);
        if (height > 100) {
          element.style.height = height + 'px';
          element.style.top = startTop + (e.clientY - startY) + 'px';
        }
      }
    }
    
    function stopResize() {
      // Remove event listeners
      document.onmouseup = null;
      document.onmousemove = null;
      
      // Remove resizing class
      element.classList.remove('resizing');
    }
  }
}

// Focus a window (bring to front)
function focusWindow(windowId) {
  if (activeWindowId === windowId) return;
  
  // Update active window
  activeWindowId = windowId;
  
  // Update z-index of all windows
  windows.forEach(win => {
    if (win.id === windowId) {
      win.element.style.zIndex = ++highestZIndex;
      win.element.classList.add('active');
    } else {
      win.element.classList.remove('active');
    }
  });
}

// Close a window
function closeWindow(windowId) {
  const index = windows.findIndex(win => win.id === windowId);
  if (index === -1) return;
  
  const win = windows[index];
  
  // Add closing animation class
  win.element.classList.add('closing');
  
  // Remove after animation
  setTimeout(() => {
    // Remove from DOM
    win.element.remove();
    
    // Remove from windows array
    windows.splice(index, 1);
    
    // Notify that app is closed
    window.EventBus.publish('appClosed', { app: win.app });
    
    // Update active window if needed
    if (activeWindowId === windowId) {
      activeWindowId = null;
      
      // Focus the top-most window if any
      if (windows.length > 0) {
        const topWindow = windows.reduce((prev, current) => {
          return parseInt(current.element.style.zIndex) > parseInt(prev.element.style.zIndex)
            ? current : prev;
        });
        
        focusWindow(topWindow.id);
      }
    }
  }, 200);
}

// Minimize a window
function minimizeWindow(windowId) {
  const win = windows.find(w => w.id === windowId);
  if (!win) return;
  
  // Add minimizing class
  win.element.classList.add('minimizing');
  
  // Hide the window
  setTimeout(() => {
    win.element.style.display = 'none';
    win.element.classList.remove('minimizing');
    win.minimized = true;
    
    // Update active window
    if (activeWindowId === windowId) {
      activeWindowId = null;
    }
  }, 200);
}

// Toggle maximize state of a window
function toggleMaximizeWindow(windowId) {
  const win = windows.find(w => w.id === windowId);
  if (!win) return;
  
  if (win.maximized) {
    // Restore window
    win.element.style.width = win.prevWidth;
    win.element.style.height = win.prevHeight;
    win.element.style.top = win.prevTop;
    win.element.style.left = win.prevLeft;
    win.maximized = false;
  } else {
    // Save current dimensions
    win.prevWidth = win.element.style.width;
    win.prevHeight = win.element.style.height;
    win.prevTop = win.element.style.top;
    win.prevLeft = win.element.style.left;
    
    // Maximize window
    win.element.style.width = '100%';
    win.element.style.height = 'calc(100% - 24px)';
    win.element.style.top = '24px';
    win.element.style.left = '0';
    win.maximized = true;
  }
}