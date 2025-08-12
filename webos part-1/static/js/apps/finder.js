class Finder {
    constructor() {
        this.currentPath = '/';
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.files = [];
    }

    async init() {
        await this.loadFiles();
        this.setupUI();
        this.setupEventListeners();
    }

    async loadFiles() {
        try {
            const response = await fetch('/api/files', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            this.files = data;
            this.renderFiles();
        } catch (error) {
            console.error('Failed to load files:', error);
        }
    }

    setupUI() {
        const content = document.getElementById('finder-content');
        content.innerHTML = `
            <div class="finder-toolbar">
                <button class="view-toggle" data-view="grid">
                    <i class="fas fa-th-large"></i>
                </button>
                <button class="view-toggle" data-view="list">
                    <i class="fas fa-list"></i>
                </button>
                <div class="path-navigation">
                    <span class="path-segment">Home</span>
                </div>
            </div>
            <div class="finder-content ${this.viewMode}-view">
                <div class="files-container"></div>
            </div>
        `;
    }

    setupEventListeners() {
        const content = document.getElementById('finder-content');
        
        // View toggle buttons
        content.querySelectorAll('.view-toggle').forEach(button => {
            button.addEventListener('click', () => {
                this.viewMode = button.dataset.view;
                this.renderFiles();
            });
        });

        // File double-click
        content.addEventListener('dblclick', (e) => {
            const fileElement = e.target.closest('.file-item');
            if (fileElement) {
                this.openFile(fileElement.dataset.fileId);
            }
        });
    }

    renderFiles() {
        const container = document.querySelector('.files-container');
        container.innerHTML = '';

        this.files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = `file-item ${this.viewMode}-item`;
            fileElement.dataset.fileId = file.id;
            
            const icon = this.getFileIcon(file.type);
            const size = this.formatFileSize(file.size);
            
            fileElement.innerHTML = `
                <div class="file-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.filename}</div>
                    <div class="file-details">
                        <span class="file-size">${size}</span>
                        <span class="file-date">${new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(fileElement);
        });
    }

    getFileIcon(fileType) {
        const icons = {
            'image': 'fas fa-file-image',
            'document': 'fas fa-file-alt',
            'pdf': 'fas fa-file-pdf',
            'video': 'fas fa-file-video',
            'audio': 'fas fa-file-audio',
            'archive': 'fas fa-file-archive',
            'code': 'fas fa-file-code',
            'default': 'fas fa-file'
        };

        if (fileType.startsWith('image/')) return icons.image;
        if (fileType.startsWith('text/')) return icons.document;
        if (fileType === 'application/pdf') return icons.pdf;
        if (fileType.startsWith('video/')) return icons.video;
        if (fileType.startsWith('audio/')) return icons.audio;
        if (fileType.startsWith('application/zip') || fileType.startsWith('application/x-rar')) return icons.archive;
        if (fileType.startsWith('text/') && fileType.includes('javascript') || fileType.includes('python')) return icons.code;
        
        return icons.default;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async openFile(fileId) {
        const file = this.files.find(f => f.id === parseInt(fileId));
        if (!file) return;

        // Handle different file types
        switch (file.type) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                this.openImageViewer(file);
                break;
            case 'text/plain':
                this.openTextEditor(file);
                break;
            default:
                // Download the file
                window.open(`/api/files/download/${fileId}`, '_blank');
        }
    }

    openImageViewer(file) {
        // Create image viewer window
        const window = document.createElement('div');
        window.className = 'window';
        window.style.left = '100px';
        window.style.top = '100px';
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">${file.filename}</div>
                <div class="window-controls">
                    <div class="window-control window-close"></div>
                </div>
            </div>
            <div class="window-content">
                <img src="/api/files/download/${file.id}" alt="${file.filename}">
            </div>
        `;
        
        document.getElementById('desktop').appendChild(window);
        makeDraggable(window, window.querySelector('.window-header'));
    }

    openTextEditor(file) {
        // Create text editor window
        const window = document.createElement('div');
        window.className = 'window';
        window.style.left = '100px';
        window.style.top = '100px';
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">${file.filename}</div>
                <div class="window-controls">
                    <div class="window-control window-close"></div>
                </div>
            </div>
            <div class="window-content">
                <textarea class="text-editor">Loading...</textarea>
            </div>
        `;
        
        document.getElementById('desktop').appendChild(window);
        makeDraggable(window, window.querySelector('.window-header'));
        
        // Load file content
        fetch(`/api/files/content/${file.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.text())
        .then(content => {
            window.querySelector('.text-editor').value = content;
        });
    }
}

// Initialize Finder when the app is launched
function initFinder() {
    const finder = new Finder();
    finder.init();
}