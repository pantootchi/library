const addButton = document.querySelector('.add-button');
const shelves = document.querySelectorAll('.shelf');
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const submitButton = document.querySelector("button");
const inputValue = document.querySelectorAll('input');

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

submitButton.addEventListener("click", addBookToLibrary)

function addBookToLibrary() {
    // Put inputted values into an array
    let arguments = []

    inputValue.forEach((arg) => {
        if (arg.type == "checkbox") {
            arguments.push(arg.checked);
        } else {
            arguments.push(arg.value);
        }
    })

    arguments.push(bookCounter += 1);

    // Create new Book object
    const newBook = new Book(...arguments);

    // Add new Book object to myLibrary array
    myLibrary.push(newBook)
    
    // Visually display new Book object
    displayBook(newBook);

    // Close modal
    toggleModal();
}

function generateRGB() {
    let R = Math.floor(Math.random() * 255);
    let G = Math.floor(Math.random() * 255);
    let B = Math.floor(Math.random() * 255);
    return `rgb(${R}, ${G}, ${B})`;
}

function displayBook(bookObj) {
    const bookElement = document.createElement('span');
    bookElement.textContent = bookObj.title;
    bookElement.classList.add("book");
    bookElement.setAttribute('id', bookObj.id)
    bookElement.style.backgroundColor = generateRGB();

    for (i = 0; i < shelves.length; i++) {
        if (shelves[i].children.length != FULL_SHELF) {
            shelves[i].appendChild(bookElement);
            break;
        }
    }
}
