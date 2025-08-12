// Notes app logic
const NOTES_KEY = 'webos-notes';

function loadNotes() {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
}

function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function renderNotesList(container, notes) {
    container.innerHTML = '';
    notes.forEach(note => {
        const item = document.createElement('div');
        item.className = 'note-item';
        item.textContent = note.title || 'Untitled';
        item.dataset.id = note.id;
        container.appendChild(item);
    });
}

function setupNotesUI(win) {
    const appEl = win.querySelector('#notes-app');
    if (!appEl) return;
    const listEl = appEl.querySelector('.notes-list');
    const textarea = appEl.querySelector('.notes-editor textarea');
    const newBtn = appEl.querySelector('#new-note');
    let notes = loadNotes();
    let currentId = null;
    renderNotesList(listEl, notes);
    newBtn.addEventListener('click', () => {
        const id = Date.now().toString();
        const newNote = { id, title: 'Untitled', content: '' };
        notes.push(newNote);
        saveNotes(notes);
        renderNotesList(listEl, notes);
        currentId = id;
        textarea.value = '';
        textarea.focus();
    });
    listEl.addEventListener('click', e => {
        const id = e.target.dataset.id;
        if (!id) return;
        currentId = id;
        const note = notes.find(n => n.id === id);
        if (note) {
            textarea.value = note.content;
        }
    });
    textarea.addEventListener('input', e => {
        if (!currentId) return;
        const note = notes.find(n => n.id === currentId);
        if (note) {
            note.content = textarea.value;
            note.title = textarea.value.split('\n')[0] || 'Untitled';
            saveNotes(notes);
            renderNotesList(listEl, notes);
        }
    });
}

// Hook into window creation
EventBus.subscribe('app:open', ({ name }) => {
    if (name.toLowerCase() === 'notes') {
        // wait for window creation
        setTimeout(() => {
            const win = document.querySelector('.window[data-app="notes"]');
            if (win) setupNotesUI(win);
        }, 100);
    }
});
