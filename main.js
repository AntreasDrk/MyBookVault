"user strict";

// array to store books
const books = [];

// id elements of the form
const form = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusSelect = document.getElementById("status");

const bookList = document.getElementById("book-list");

// eventlistener that once the form is submited a book is added in the array books
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const newBook = {
    id: Date.now(),
    title: titleInput.value,
    author: authorInput.value,
    status: statusSelect.value,
  };

  books.push(newBook);

  console.log(books);

  form.reset();
});

// display added books to page
const renderBooks = function (booksContainer) {
  booksContainer.innerHTML = "";
};

renderBooks(bookList);
