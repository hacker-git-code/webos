class TextEditor {
    constructor() {
        this.currentFile = null;
        this.isDirty = false;
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
    }

    setupUI() {
        const content = document.getElementById('text-editor-content');
        content.innerHTML = `
            <div class="editor-toolbar">
                <button class="toolbar-btn" data-action="new">
                    <i class="fas fa-file"></i> New
                </button>
                <button class="toolbar-btn" data-action="open">
                    <i class="fas fa-folder-open"></i> Open
                </button>
                <button class="toolbar-btn" data-action="save">
                    <i class="fas fa-save"></i> Save
                </button>
                <div class="toolbar-separator"></div>
                <button class="toolbar-btn" data-action="undo">
                    <i class="fas fa-undo"></i>
                </button>
                <button class="toolbar-btn" data-action="redo">
                    <i class="fas fa-redo"></i>
                </button>
                <div class="toolbar-separator"></div>
                <button class="toolbar-btn" data-action="cut">
                    <i class="fas fa-cut"></i>
                </button>
                <button class="toolbar-btn" data-action="copy">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="toolbar-btn" data-action="paste">
                    <i class="fas fa-paste"></i>
                </button>
            </div>
            <div class="editor-content">
                <textarea id="editor-textarea" spellcheck="false"></textarea>
            </div>
            <div class="editor-statusbar">
                <span class="status-item">Ln 1, Col 1</span>
                <span class="status-item">UTF-8</span>
                <span class="status-item">Plain Text</span>
            </div>
        `;
    }

    setupEventListeners() {
        const content = document.getElementById('text-editor-content');
        const textarea = content.querySelector('#editor-textarea');

        // Toolbar buttons
        content.querySelectorAll('.toolbar-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleToolbarAction(button.dataset.action);
            });
        });

        // Text changes
        textarea.addEventListener('input', () => {
            this.isDirty = true;
            this.updateStatusBar();
        });

        // Cursor position
        textarea.addEventListener('click', () => this.updateStatusBar());
        textarea.addEventListener('keyup', () => this.updateStatusBar());
    }

    handleToolbarAction(action) {
        const textarea = document.querySelector('#editor-textarea');
        
        switch (action) {
            case 'new':
                if (this.isDirty) {
                    if (confirm('Save changes?')) {
                        this.saveFile();
                    }
                }
                this.newFile();
                break;
                
            case 'open':
                this.openFile();
                break;
                
            case 'save':
                this.saveFile();
                break;
                
            case 'undo':
                document.execCommand('undo', false, null);
                break;
                
            case 'redo':
                document.execCommand('redo', false, null);
                break;
                
            case 'cut':
                document.execCommand('cut', false, null);
                break;
                
            case 'copy':
                document.execCommand('copy', false, null);
                break;
                
            case 'paste':
                document.execCommand('paste', false, null);
                break;
        }
    }

    newFile() {
        const textarea = document.querySelector('#editor-textarea');
        textarea.value = '';
        this.currentFile = null;
        this.isDirty = false;
        this.updateStatusBar();
    }

    async openFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.md,.js,.py,.html,.css';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const content = await file.text();
                const textarea = document.querySelector('#editor-textarea');
                textarea.value = content;
                this.currentFile = file;
                this.isDirty = false;
                this.updateStatusBar();
            } catch (error) {
                console.error('Failed to open file:', error);
            }
        };
        
        input.click();
    }

    async saveFile() {
        const textarea = document.querySelector('#editor-textarea');
        const content = textarea.value;
        
        if (!this.currentFile) {
            // Create new file
            const blob = new Blob([content], { type: 'text/plain' });
            const file = new File([blob], 'untitled.txt');
            
            const formData = new FormData();
            formData.append('file', file);
            
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
                    this.currentFile = file;
                    this.isDirty = false;
                    this.updateStatusBar();
                }
            } catch (error) {
                console.error('Failed to save file:', error);
            }
        } else {
            // Update existing file
            try {
                const response = await fetch(`/api/files/${this.currentFile.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content })
                });
                
                if (response.ok) {
                    this.isDirty = false;
                    this.updateStatusBar();
                }
            } catch (error) {
                console.error('Failed to save file:', error);
            }
        }
    }

    updateStatusBar() {
        const textarea = document.querySelector('#editor-textarea');
        const statusItems = document.querySelectorAll('.status-item');
        
        // Update cursor position
        const pos = this.getCursorPosition(textarea);
        statusItems[0].textContent = `Ln ${pos.line}, Col ${pos.column}`;
    }

    getCursorPosition(textarea) {
        const pos = textarea.selectionStart;
        const text = textarea.value;
        const lines = text.substring(0, pos).split('\n');
        
        return {
            line: lines.length,
            column: lines[lines.length - 1].length + 1
        };
    }
}

// Initialize Text Editor when the app is launched
function initTextEditor() {
    const editor = new TextEditor();
    editor.init();
}