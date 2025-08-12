class Notes {
    constructor() {
        this.notes = [];
        this.currentNote = null;
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
        this.loadNotes();
    }

    setupUI() {
        const content = document.getElementById('notes-content');
        content.innerHTML = `
            <div class="notes-sidebar">
                <div class="sidebar-header">
                    <h2>Notes</h2>
                    <button class="new-note-btn">
                        <i class="fas fa-plus"></i> New Note
                    </button>
                </div>
                <div class="search-box">
                    <input type="text" placeholder="Search notes...">
                </div>
                <div class="notes-list"></div>
            </div>
            <div class="notes-editor">
                <div class="editor-toolbar">
                    <button class="toolbar-btn" data-action="bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button class="toolbar-btn" data-action="italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button class="toolbar-btn" data-action="underline">
                        <i class="fas fa-underline"></i>
                    </button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-btn" data-action="list">
                        <i class="fas fa-list"></i>
                    </button>
                    <button class="toolbar-btn" data-action="checklist">
                        <i class="fas fa-tasks"></i>
                    </button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-btn" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="editor-content" contenteditable="true"></div>
            </div>
        `;
    }

    setupEventListeners() {
        const content = document.getElementById('notes-content');
        
        // New note button
        content.querySelector('.new-note-btn').addEventListener('click', () => {
            this.createNewNote();
        });

        // Search box
        content.querySelector('.search-box input').addEventListener('input', (e) => {
            this.filterNotes(e.target.value);
        });

        // Toolbar buttons
        content.querySelectorAll('.toolbar-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleToolbarAction(button.dataset.action);
            });
        });

        // Editor content changes
        const editor = content.querySelector('.editor-content');
        editor.addEventListener('input', () => {
            if (this.currentNote) {
                this.currentNote.content = editor.innerHTML;
                this.saveNote(this.currentNote);
            }
        });
    }

    async loadNotes() {
        try {
            const response = await fetch('/api/notes', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            this.notes = data;
            this.renderNotesList();
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }

    renderNotesList() {
        const notesList = document.querySelector('.notes-list');
        notesList.innerHTML = '';
        
        this.notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.dataset.noteId = note.id;
            
            const title = note.title || 'Untitled Note';
            const preview = note.content ? note.content.replace(/<[^>]*>/g, '').substring(0, 50) : '';
            
            noteElement.innerHTML = `
                <div class="note-title">${title}</div>
                <div class="note-preview">${preview}</div>
                <div class="note-date">${new Date(note.updated_at).toLocaleDateString()}</div>
            `;
            
            noteElement.addEventListener('click', () => {
                this.openNote(note);
            });
            
            notesList.appendChild(noteElement);
        });
    }

    createNewNote() {
        const newNote = {
            title: 'Untitled Note',
            content: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        this.notes.unshift(newNote);
        this.renderNotesList();
        this.openNote(newNote);
    }

    openNote(note) {
        this.currentNote = note;
        
        const editor = document.querySelector('.editor-content');
        editor.innerHTML = note.content || '';
        
        // Update active note in list
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.noteId === note.id) {
                item.classList.add('active');
            }
        });
    }

    async saveNote(note) {
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(note)
            });
            
            const data = await response.json();
            const index = this.notes.findIndex(n => n.id === data.id);
            if (index !== -1) {
                this.notes[index] = data;
            } else {
                this.notes.unshift(data);
            }
            
            this.renderNotesList();
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    }

    async deleteNote(noteId) {
        try {
            await fetch(`/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            this.notes = this.notes.filter(note => note.id !== noteId);
            this.renderNotesList();
            
            if (this.currentNote && this.currentNote.id === noteId) {
                this.currentNote = null;
                document.querySelector('.editor-content').innerHTML = '';
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    }

    filterNotes(query) {
        const filteredNotes = this.notes.filter(note => {
            const title = note.title || '';
            const content = note.content || '';
            return title.toLowerCase().includes(query.toLowerCase()) ||
                   content.toLowerCase().includes(query.toLowerCase());
        });
        
        this.renderFilteredNotes(filteredNotes);
    }

    renderFilteredNotes(filteredNotes) {
        const notesList = document.querySelector('.notes-list');
        notesList.innerHTML = '';
        
        filteredNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.dataset.noteId = note.id;
            
            const title = note.title || 'Untitled Note';
            const preview = note.content ? note.content.replace(/<[^>]*>/g, '').substring(0, 50) : '';
            
            noteElement.innerHTML = `
                <div class="note-title">${title}</div>
                <div class="note-preview">${preview}</div>
                <div class="note-date">${new Date(note.updated_at).toLocaleDateString()}</div>
            `;
            
            noteElement.addEventListener('click', () => {
                this.openNote(note);
            });
            
            notesList.appendChild(noteElement);
        });
    }

    handleToolbarAction(action) {
        const editor = document.querySelector('.editor-content');
        
        switch (action) {
            case 'bold':
                document.execCommand('bold', false, null);
                break;
                
            case 'italic':
                document.execCommand('italic', false, null);
                break;
                
            case 'underline':
                document.execCommand('underline', false, null);
                break;
                
            case 'list':
                document.execCommand('insertUnorderedList', false, null);
                break;
                
            case 'checklist':
                // Implement checklist functionality
                break;
                
            case 'delete':
                if (this.currentNote) {
                    if (confirm('Are you sure you want to delete this note?')) {
                        this.deleteNote(this.currentNote.id);
                    }
                }
                break;
        }
    }
}

// Initialize Notes when the app is launched
function initNotes() {
    const notes = new Notes();
    notes.init();
}