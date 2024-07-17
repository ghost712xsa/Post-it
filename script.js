document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('addNote');
    const notesContainer = document.getElementById('notes');

    const colors = ['yellow', 'lightblue', 'lightgreen', 'lightcoral'];

    const loadNotes = () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesContainer.innerHTML = '';
        notes.forEach(note => createNoteElement(note.id, note.content, note.color, note.position));
    };

    const saveNotes = () => {
        const notes = [];
        document.querySelectorAll('.note').forEach(noteElement => {
            const id = noteElement.getAttribute('data-id');
            const content = noteElement.querySelector('textarea').value;
            const color = noteElement.style.backgroundColor;
            const position = {
                left: noteElement.style.left,
                top: noteElement.style.top
            };
            notes.push({ id, content, color, position });
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    const createNoteElement = (id, content = '', color = 'yellow', position = { left: '50%', top: '50%' }) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = color;
        noteElement.setAttribute('data-id', id);
        noteElement.style.left = position.left;
        noteElement.style.top = position.top;

        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.addEventListener('input', saveNotes);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            noteElement.remove();
            saveNotes();
        });

        const colorPicker = document.createElement('div');
        colorPicker.className = 'color-picker';

        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.style.backgroundColor =
                        colorOption.style.backgroundColor = color;
            colorOption.addEventListener('click', () => {
                noteElement.style.backgroundColor = color;
                saveNotes();
            });
            colorPicker.appendChild(colorOption);
        });

        noteElement.appendChild(textarea);
        noteElement.appendChild(deleteButton);
        noteElement.appendChild(colorPicker);
        notesContainer.appendChild(noteElement);

        // Tornar o post-it flutuante
        noteElement.addEventListener('mousedown', (e) => {
            const offsetX = e.clientX - noteElement.getBoundingClientRect().left;
            const offsetY = e.clientY - noteElement.getBoundingClientRect().top;

            const onMouseMove = (e) => {
                noteElement.style.left = `${e.clientX - offsetX}px`;
                noteElement.style.top = `${e.clientY - offsetY}px`;
            };

            document.addEventListener('mousemove', onMouseMove);

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
                saveNotes();
            }, { once: true });
        });

        saveNotes();
    };

    addNoteButton.addEventListener('click', () => {
        const id = Date.now().toString();
        createNoteElement(id);
    });

    loadNotes();
});

