const addButton = document.querySelector('.add-button');
const shelves = document.querySelectorAll('.shelf');
const formModal = document.querySelector(".form-modal");
const closeButton = document.querySelector(".form-modal .close-button");
const generalCloseButtons = document.querySelectorAll(".general");
const addBookForm = document.getElementById("addBookForm");
const bookModal = document.querySelector(".book-modal");
const libraryModal = document.querySelector(".library-modal");
const bookInfo = document.querySelector(".book-info");
const removeButton = document.querySelector('.remove');
const libraryTitle = document.querySelector('body > h1');
const tableContainer = document.querySelector('.table-container');
const tBody = document.querySelector('tbody');

const FULL_SHELF = 22;
let myLibrary = [];
let bookCounter = 0;

// CLOSE BUTTONS
closeButton.addEventListener("click", toggleFormModal);
window.addEventListener("click", windowOnClick);
generalCloseButtons.forEach((generalButton) => {generalButton.addEventListener("click", closeModal)});

function closeModal() {
    if (bookModal.classList.value.includes('show-modal')) {
        bookModal.classList.remove("show-modal");
    } else if (libraryModal.classList.value.includes('show-modal')) {
        libraryModal.classList.remove("show-modal");
    }
}

// Any outside window click will close current active modal
function windowOnClick(event) {
    if (event.target === formModal) {
        toggleFormModal();
    } else if (event.target === bookModal || event.target == libraryModal) {
        closeModal();
    }
}

// FORM MODAL
addButton.addEventListener("click", toggleFormModal);

function toggleFormModal() {
    formModal.classList.toggle("show-modal");
    if (formModal.classList.value.includes('show-modal')) {
        // Book form resets when FORM MODAL opens
        addBookForm.reset();
    }
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

    // Creates NodeList of all Book elements
    bookElementList();

    // Closes modal
    toggleFormModal();
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

    // Append new Book element to the DOM
    for (i = 0; i < shelves.length; i++) {
        if (shelves[i].children.length != FULL_SHELF) {
            shelves[i].appendChild(bookElement);
            break;
        }
    }
}

function bookElementList() {
    // Initializes bookElements variable to a NodeList of books
    bookElements = document.querySelectorAll('.book');

    // Activates event listener for each book nodes
    bookElements.forEach((book) => {book.addEventListener('click', openBookModal)})
}

// BOOK MODAL
function openBookModal(e) {
    // Reset Book Modal's content
    bookInfo.textContent = '';
    // Generate Book Modal's content
    generateBookInfo(e.target.id);
    // Open Book Modal
    bookModal.classList.add("show-modal");
}

function generateBookInfo(e) {
    for (let i = 0; i < myLibrary.length; i++) {
        if(e == myLibrary[i].id) {

            const book = document.createElement('div');
            const title = document.createElement('h1');
            title.textContent = myLibrary[i].title;
            const author = document.createElement('h2');
            author.textContent = `by ${myLibrary[i].author}`

            const div = document.createElement('div');
            div.classList.add('book-sub-info');
            const pages = document.createElement('p');
            pages.textContent = `Pages: ${myLibrary[i].pages}`
            const bookId = document.createElement('p');
            bookId.textContent = `Book ID: ${myLibrary[i].id}`

            const div2 = document.createElement('div');
            div2.classList.add('book-sub-info');
            const read = document.createElement('p');
            read.textContent = "Read";

            const label = document.createElement('label');
            label.classList.add('switch');
            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            const span = document.createElement('span');
            span.classList.add('slider', 'round');

            bookInfo.append(book, author, div, read, div2);
            book.append(title, author);
            label.append(input, span);
            div.append(pages, bookId);
            div2.append(read, label);

            // Display current read value
            input.checked = myLibrary[i].read;

            // Update read value
            input.addEventListener('change', function() {
                myLibrary[i].read = this.checked;
            })

            // Add book ID to the remove button's ID so it knows which one to remove when clicked
            removeButton.id = myLibrary[i].id;
            break;
        }
    }
}

// REMOVE BUTTON
removeButton.addEventListener("click", removeBookFromLibrary);

function removeBookFromLibrary() {
    for (let i = 0; i < myLibrary.length; i++) {
        if(this.id == myLibrary[i].id) {

            // Removes book object from myLibrary array
            myLibrary.splice(i,1);

            // Removes book visually
            bookElements.forEach((book) => {
                if (book.id == this.id) {

                    // Removes individual book node
                    book.remove();
                    // Breaks the forEach loop
                    return;
                }
            });

            if (bookModal.classList.value.includes('show-modal')) {
                closeModal();
            }

            break;
        }
    }
}

// LIBRARY MODAL
libraryTitle.addEventListener("click", openLibraryModal);

function openLibraryModal() {
    // Reset Table's Content
    tBody.textContent = '';

    // Removes "No Book" error
    if (tableContainer.lastChild.nodeType == 1) {
        tableContainer.lastChild.remove();
    }

    // Generate Library Modal's Content
    generateBookList();

    //Create NodeList of all Checkbox elements
    checkBoxNodeList();

    //Create NodeList of all Delete elements
    deleteNodeList();

    // Open Library Modal
    libraryModal.classList.add('show-modal');
}

function generateBookList() {
    if (myLibrary.length  > 0) {
        for (let book = 0; book < myLibrary.length; book++) {
            const newRow = document.createElement('tr');

            for(let value = 0; value < 6; value++) {
                const newCell = document.createElement('td');

                if (value < 4) {
                    newCell.textContent = Object.values(myLibrary[book])[value];
                } else if (value == 4){
                    const checkBox = document.createElement('input');
                    checkBox.setAttribute('type', 'checkbox');
                    checkBox.id = myLibrary[book].id;
                    checkBox.checked = myLibrary[book].read;
                    newCell.appendChild(checkBox);
                } else {
                    const span = document.createElement('span');
                    span.id = myLibrary[book].id;
                    span.textContent = "✘";
                    newCell.appendChild(span);
                }

                tBody.appendChild(newRow);
                newRow.appendChild(newCell);
            }
        }
    } else {
        // Generate No Book error if myLibrary is empty
        const noBooks = document.createElement('p');
        noBooks.classList.add('no-book-error');
        noBooks.textContent = "You do not have any books in your library."
        tableContainer.appendChild(noBooks);
    }
}

function checkBoxNodeList() {
    // Initializes checkBoxElements variable to a NodeList of checkboxes
    const checkBoxElements = document.querySelectorAll('td input');

    // Activates event listener for each checkbox nodes
    checkBoxElements.forEach((checkbox) => {checkbox.addEventListener('change', function() {
        for (let i = 0; i < myLibrary.length; i++) {
            if (this.id == myLibrary[i].id) {
                myLibrary[i].read = this.checked;
                break;
            }
        }
    })})
}

function deleteNodeList() {
    const deleteElements = document.querySelectorAll('td span[id]');

    deleteElements.forEach((del) => {del.addEventListener("click", function() {
        // Removes from table list
        this.parentElement.parentElement.remove();
    })})

    deleteElements.forEach((del) => {del.addEventListener("click", removeBookFromLibrary)})

}

/* If the page loads and there already is a saved list of books (myLibrary)
then this will populate the shelves when the page loads */
/*window.addEventListener('load', function () {
    for (let i = 0; i < myLibrary.length; i++) {
        displayBook(myLibrary[i]);
    };
    bookElementList();
});*/