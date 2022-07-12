const addButton = document.querySelector('.add-button');
const shelves = document.querySelectorAll('.shelf');
const formModal = document.querySelector(".form-modal");
const addBookForm = document.getElementById("addBookForm");
const bookModal = document.querySelector(".book-modal");
const libraryModal = document.querySelector(".library-modal");
const bookInfo = document.querySelector(".book-info");
const removeButton = document.querySelector('.remove');
const libraryTitle = document.querySelector('body > h1');
const tableBody = document.querySelector('tbody');
const noBookError = document.querySelector('.no-book-error');
const dataPropertyList = document.querySelectorAll('[data-property]');
const readSwitch = document.querySelector('.switch input');
const closeButtons = document.querySelectorAll(".close-button");
const allModals = document.querySelectorAll('.modal');

const FULL_SHELF = 22;
let myLibrary = [];
let bookCounter = 0;

// If cachedlibrary exist, then set myLibrary array equal to cachedLibrary
if (localStorage.cachedLibrary) {
    myLibrary = JSON.parse(localStorage.getItem("cachedLibrary"));
}

// Whenever the page loads and cachedLibrary exist, then this will populate the shelves.
window.addEventListener('load', function () {
    for (let i = 0; i < myLibrary.length; i++) {
        // Re-assigns book objects' id from 1
        myLibrary[i].id = bookCounter = i+1;
        // Re-displays all book visually
        displayBook(myLibrary[i]);
    }
})

// CLOSE BUTTONS
closeButtons.forEach((closeButton) => {closeButton.addEventListener("click", closeModal)});

window.addEventListener("click", function (e) {
    allModals.forEach((modal) => {if (e.target == modal) closeModal()});
});

function closeModal() {
    allModals.forEach((modal) => {modal.classList.remove("show-modal")});
}

// FORM MODAL
addButton.addEventListener("click", openFormModal);

function openFormModal() {
    // Resets Book Form
    addBookForm.reset();
    // Opens Form Modal
    formModal.classList.add("show-modal");
}

addBookForm.addEventListener("submit", addBookToLibrary);

function addBookToLibrary(e) {
    // Stops form from submitting values
    e.preventDefault();
    // Creates new Book object
    const newBook = createBookObject();
    // Adds new Book object to myLibrary array
    myLibrary.push(newBook)
    // Visually displays new Book object
    displayBook(newBook);
    // Saves myLibrary array to local storage called cachedLibrary
    localStorage.setItem("cachedLibrary", JSON.stringify(myLibrary));
    // Closes Form Modal
    closeModal();
}

function Book (title, author, pages, id, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.id = id
    this.read = read
}

function createBookObject() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const id = bookCounter += 1;
    const read = document.getElementById('read').checked;

    return new Book(title, author, pages, id, read);
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
    // Add "click" event listener for book element
    bookElement.addEventListener('click', openBookModal);
    // Append new Book element to the DOM
    Array.from(shelves).find(shelf => shelf.children.length != FULL_SHELF).appendChild(bookElement);

}

// BOOK MODAL
function openBookModal(e) {
    // Reset Book Modal's Content
    dataPropertyList.forEach((data) => data.textContent = '')
    // Generate Book Modal's content
    generateBookInfo(e.target.id);
    // Open Book Modal
    bookModal.classList.add("show-modal");
}

function generateBookInfo(bookNodeId) {
    let myBook = myLibrary.find((book) => book.id == bookNodeId);

    for (let node of dataPropertyList) {
        for (let [key, value] of Object.entries(myBook)) {
            if (node.getAttribute('data-property') === key) node.textContent = value;
        }
    }

    // Display current read value
    readSwitch.checked = myBook.read;
    // Add book ID to the remove button's ID and checkbox's ID
    removeButton.id = readSwitch.id = myBook.id;
}

// READ SWITCH BUTTON
readSwitch.addEventListener('change', changeReadStatus)

function changeReadStatus() {
    // Updates book object's read status
    myLibrary.find((book) => book.id == this.id).read = this.checked;
    // Update cachedLibrary
    localStorage.setItem("cachedLibrary", JSON.stringify(myLibrary));
}


// REMOVE BUTTON
removeButton.addEventListener("click", function() {
    // Removes book visually and from myLibrary array
    removeBookFromLibrary.call(this);
    // Close Book Modal
    closeModal();
})

function removeBookFromLibrary() {
    // Removes book object from myLibrary array
    myLibrary.splice(myLibrary.findIndex((book) => book.id == this.id), 1);
    // Update cachedLibrary
    localStorage.setItem("cachedLibrary", JSON.stringify(myLibrary));
    // Removes book visually
    document.querySelector(`.book[id="${this.id}"]`).remove();
}

// LIBRARY MODAL
libraryTitle.addEventListener("click", openLibraryModal);

function openLibraryModal() {
    // Reset Table's Content
    tableBody.textContent = '';
    // Generate Table of Books if myLibrary isn't empty
    (myLibrary.length) ? generateBookList() : noBookError.removeAttribute('hidden');
    // Open Library Modal
    libraryModal.classList.add('show-modal');
}

function generateBookList() {
    noBookError.setAttribute('hidden', ''); 

    myLibrary.forEach(function (book) {
        const newRow = document.createElement('tr');
        tableBody.appendChild(newRow);

        for(let value = 0; value < 6; value++) {
            const newCell = document.createElement('td');
            newRow.appendChild(newCell);

            if (value < 4) {
                newCell.textContent = Object.values(book)[value];
            } else if (value == 4){
                const checkBox = document.createElement('input');
                checkBox.setAttribute('type', 'checkbox');
                checkBox.id = book.id;
                checkBox.checked = book.read;
                newCell.appendChild(checkBox);

                checkBox.addEventListener('change', changeReadStatus);
            } else {
                const del = document.createElement('span');
                del.id = book.id;
                del.textContent = "✘";
                newCell.appendChild(del);

                del.addEventListener("click", deleteBtnFunc);
            }
        }
    })    
}

function deleteBtnFunc() {
    // Removes book visually and from myLibrary array
    removeBookFromLibrary.call(this);
    // Removes from table list
    this.parentElement.parentElement.remove();
    // Re-displays noBookError element when table is emptied
    if (!myLibrary.length) noBookError.removeAttribute('hidden');
}