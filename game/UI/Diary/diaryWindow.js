window.Diary = class {
    constructor(config) {
        this.story = clone(config.story) || [];
        this.books = clone(config.books) || [];
        this.notes = clone(config.notes) || [];
        this.active = config.active || document.querySelector('.story');
        this.noteIndex = config.noteIndex || 0;
    }
    clone() {
        return new Diary(this);
    }

    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = this[pn];
        }, this);
        return JSON.reviveWrapper("new Diary($ReviveData$)", ownData);
    }


    addEvents() {
        let diaries = document.getElementsByClassName('title');
        Array.from(diaries).forEach(section => {
            section.addEventListener('click', e => {
                this.active.classList.toggle('diaryOpen');
                this.active = document.querySelector('.' + e.target.dataset.body);
                this.active.classList.toggle('diaryOpen');
            })
        })

        document.querySelector('.addNote').addEventListener('click', () => {
            this.openNote();
            State.variables.noteOption = "add";
        })

    }

    addNote() {
        let noteValue = $('.noteInput').val();
        if (noteValue.trim().length > 0) {
            this.notes.push(noteValue);
            this.updateDiary();
            Dialog.close()
        }

    }
    
    editNote() {
        
        this.notes[this.noteIndex] = $('.noteInput').val();
        this.updateDiary();
        Dialog.close();
    }

    openNote() {
        Dialog.setup();
        Dialog.wiki('<<include "addNote">>');
        Dialog.open();
    }

    read(thisItem) {
        Dialog.setup();
        Dialog.wiki('<<include "readBook">>');
        Dialog.open();
        if (!this.books.find(book => book.name === thisItem.name)) {
            this.books.push(thisItem);
            State.variables.inventory.removeItem(thisItem);
            this.updateDiary()
        }
    }

    updateDiary() {
        document.querySelector('.books').innerHTML = "";
        document.querySelector('.story').innerHTML = "";
        document.querySelector('.noteContent').innerHTML = "";

        this.story.forEach(story => {
            let newStory = document.createElement('p');
            newStory.classList.add('storyEntry');
            newStory.innerText = story;
            document.querySelector('.story').append(newStory)
        })

        this.books.forEach(book => {
            let newBook = document.createElement('div');
            newBook.classList.add("bookEntry");
            newBook.innerText = book.title;
            newBook.addEventListener('click', e => {
                State.variables.thisItem = book;
                Dialog.setup();
                Dialog.wiki('<<include "readBook">>');
                Dialog.open();
            })
            document.querySelector('.books').append(newBook)
        })

        this.notes.forEach((note, index) => {
            let noteDiv = document.createElement('div');
            let noteText = document.createElement('p');
            let edit = document.createElement('button');
            edit.innerText = "Edit";
            edit.dataset.index = index;
            edit.addEventListener('click',(e) => {
                this.noteIndex = e.target.dataset.index;
                State.variables.noteOption = "edit";
                this.openNote()
            });
            edit.classList.add('editNote');
            let deleteNote = document.createElement('button');
            deleteNote.innerText = "Delete";
            deleteNote.dataset.index = index;
            deleteNote.addEventListener('click', e => {
                State.variables.diary.notes.splice([e.target.dataset.index],1);
                State.variables.diary.updateDiary();
            });
            deleteNote.classList.add('deleteNote')

            noteText.innerText = note;

            noteDiv.classList.add('noteEntry');
            noteDiv.dataset.noteIndex = index;

            noteDiv.append(noteText);
            noteDiv.append(edit);
            noteDiv.append(deleteNote);

            document.querySelector('.noteContent').append(noteDiv)
        })


    }
}
