const addBook = document.querySelector('.add-book');
const shelves = document.querySelectorAll('.shelf');
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

// MODAL 
function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

addBook.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);