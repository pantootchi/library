const addButton = document.querySelector('.add-button');
const shelves = document.querySelectorAll('.shelf');
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".modal .close-button");
const bookCloseButton = document.querySelector(".book-modal .close-button");
const addBookForm = document.getElementById("addBookForm");
const bookModal = document.querySelector(".book-modal");
const bookInfo = document.querySelector(".book-info");

const FULL_SHELF = 22;

// MODAL 
function toggleModal() {
    modal.classList.toggle("show-modal");
    if (modal.classList.value.includes('show-modal')) {
        addBookForm.reset();
    }
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    } else if (event.target === bookModal) {
        closeBookModal();
    }
}

addButton.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
bookCloseButton.addEventListener("click", closeBookModal);
window.addEventListener("click", windowOnClick);

let myLibrary = [];
let bookCounter = 0;
let bookElements;

function Book (title, author, pages, read, id) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.id = id
}

addBookForm.addEventListener("submit", addBookToLibrary);

function addBookToLibrary(e) {
    // Stops form from submitting values
    e.preventDefault();

    // Create new Book object
    const newBook = createBookObject();

    // Add new Book object to myLibrary array
    myLibrary.push(newBook)
    
    // Visually display new Book object
    displayBook(newBook);

    // Create NodeList of all Book elements
    bookElementList();

    // Close modal
    toggleModal();
}

function bookElementList() {
    bookElements = document.querySelectorAll('.book');

    bookElements.forEach((book) => {book.addEventListener('click', openBookModal)})
}

function openBookModal(e) {
    // Reset Book Modal's content
    bookInfo.textContent = '';
    // Generate Book Modal's content
    generateBookInfo(e.target.id);
    // Activate Book Modal
    bookModal.classList.add("show-modal");
}

function closeBookModal() {
    bookModal.classList.remove("show-modal");
}

function generateBookInfo(e) {
    for (let i = 0; i < myLibrary.length; i++) {
        if(e == myLibrary[i].id) {
            const title = document.createElement('h1');
            title.textContent = myLibrary[i].title;

            const author = document.createElement('h2');
            author.textContent = `by ${myLibrary[i].author}`

            const pages = document.createElement('p');
            pages.textContent = `Pages: ${myLibrary[i].pages}`

            const bookId = document.createElement('p');
            bookId.textContent = `Book ID: ${myLibrary[i].id}`

            const read = document.createElement('p');
            read.textContent = `Read: ${myLibrary[i].read}`

            const div = document.createElement('div');
            div.classList.add('book-sub-info');

            bookInfo.append(title, author, div, read);
            div.append(pages, bookId);
        }
    }
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
    bookElement.setAttribute('id', bookObj.id);
    bookElement.style.backgroundColor = generateRGB();

    // Append new Book element to the document
    for (i = 0; i < shelves.length; i++) {
        if (shelves[i].children.length != FULL_SHELF) {
            shelves[i].appendChild(bookElement);
            break;
        }
    }
}
