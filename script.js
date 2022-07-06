const addButton = document.querySelector('.add-button');
const shelves = document.querySelectorAll('.shelf');
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const addBookForm = document.getElementById("addBookForm");

const FULL_SHELF = 22;

// MODAL 
function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

addButton.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

let myLibrary = [];
let bookCounter = 0;

function Book (title, author, pages, read, id) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.id = id
}

// onsubmit event occurs when a form is successfully submitted
// same as addBookForm.onsubmit = addBookToLibrary
addBookForm.addEventListener("submit", addBookToLibrary);

// e is the reference for event object which will be passed to event handlers.
function addBookToLibrary(e) {
    // Stops form from submitting values
    e.preventDefault();

    // Create new Book object
    const newBook = createBookObject();

    // Add new Book object to myLibrary array
    myLibrary.push(newBook)
    
    // Visually display new Book object
    displayBook(newBook);

    // Close modal
    toggleModal();
}

function createBookObject() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read').checked;
    const id = bookCounter += 1;

    return new Book(title, author, pages, read, id);
}

function generateRGB() {
    let R = Math.floor(Math.random() * 255);
    let G = Math.floor(Math.random() * 255);
    let B = Math.floor(Math.random() * 255);
    return `rgb(${R}, ${G}, ${B})`;
}

function displayBook(bookObj) {
    // Create new Book element
    const bookElement = document.createElement('span');
    bookElement.textContent = bookObj.title;
    bookElement.classList.add("book");
    bookElement.setAttribute('id', bookObj.id)
    bookElement.style.backgroundColor = generateRGB();

    // Append new Book element to the DOM
    for (i = 0; i < shelves.length; i++) {
        if (shelves[i].children.length != FULL_SHELF) {
            shelves[i].appendChild(bookElement);
            break;
        }
    }
}
