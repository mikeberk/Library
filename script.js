const form = document.querySelector('form');
const libraryDiv = document.querySelector('.library');
const formPopUp = document.querySelector('.form-popup');
const openButton = document.querySelector('.open');
const cancelButton = document.querySelector('.close');
const deleteButtons = document.querySelectorAll('.remove');
//const readBoxes = document.querySelectorAll("input[name=tileRead]");

let myLibrary = [];

class Book {
    constructor(title, author, pages, read) {
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
    }
}

function addBookToLibrary(e) {
    e.preventDefault();

    const isRead = document.querySelector("[name='read']:checked");
    let read = isRead ? true : false;
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let pages = document.getElementById('pages').value;
    myLibrary.push(new Book(title, author, pages, read));

    form.reset();
    displayLibrary();
    closeForm();
}

function displayLibrary() {
    if (libraryDiv.hasChildNodes()){
        while (libraryDiv.firstChild) {
            libraryDiv.removeChild(libraryDiv.firstChild);
        }
    }

    myLibrary.forEach((book, i) => {

        const bookElement = document.createElement('div');
        bookElement.dataset.index = i;

        const titleElement = document.createElement('h2');
        const authorElement = document.createElement('p');
        const pagesElement = document.createElement('p');
        const readLabel = document.createElement('label');
        const readInput = document.createElement('input');
        const deleteButton = document.createElement('button');


        titleElement.textContent = `${book.title}`;
        authorElement.textContent = `By ${book.author}`;
        pagesElement.textContent = `Pages: ${book.pages}`;
        readLabel.textContent = "Read ";
        readInput.setAttribute('type', 'checkbox');
        readInput.name = "tileRead";
        readInput.checked = book.read;
        deleteButton.textContent = 'Remove';
        deleteButton.classList = 'remove';

        libraryDiv.appendChild(bookElement);
        bookElement.appendChild(titleElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(pagesElement);
        bookElement.appendChild(readLabel);
        readLabel.appendChild(readInput);
        bookElement.appendChild(deleteButton);
    });

    document.querySelectorAll('.remove')
            .forEach(button => button.addEventListener('click', removeFromLibary));
    localStorage.clear();
    localStorage.setItem("library", JSON.stringify(myLibrary));
}

// toggle form display for creating a new book
function openForm() {
    formPopUp.style.display = "block";
}

function closeForm() {
    formPopUp.style.display = "none";
}

// delete book from library
function removeFromLibary(e) {
    let index = parseInt(e.target.parentNode.dataset.index);
    myLibrary.splice(index, 1);
    displayLibrary();
}

// acknowledge "read" state change
function toggleRead(e) {
    if (e.target && e.target.name == 'tileRead') {
        let readIndex = parseInt(e.target.parentNode.parentNode.dataset.index);
        myLibrary[readIndex].read = e.target.checked;
    }
}

openButton.addEventListener('click', openForm);
form.addEventListener('submit', addBookToLibrary);
cancelButton.addEventListener('click', closeForm);
deleteButtons.forEach(button => button.addEventListener('click', removeFromLibary));
document.addEventListener('change', toggleRead);


window.addEventListener('load', () => {
    if (!localStorage.library) {
        myLibrary.push(new Book("Sample Title", "Some Author", "300", "Read"));
        displayLibrary();
        myLibrary.push(new Book("Other Title", "Other Author", "250", "Not Read"));
        displayLibrary();
    } else {
        let localLibrary = JSON.parse(localStorage.getItem("library"));
        // need to add a loop to create book classes of each obj stored in parsed array
        localLibrary.forEach(book => {
            myLibrary.push(new Book(book.title, book.author, book.pages, book.read));
        })
        displayLibrary();
    }
    
});