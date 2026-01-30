"user strict";

// array to store books
const books = [];

// id elements of the form
const form = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusSelect = document.getElementById("status");

const bookList = document.getElementById("book-list");

// display added books to page
function renderBooks(books) {
  bookList.textContent = "";

  books.forEach(function (book) {
    let list = document.createElement("li");
    list.innerHTML = `${book.title} - ${book.author} - ${book.status}`;
    console.log(list);
    bookList.appendChild(list);
  });
}

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
  renderBooks(books);

  console.log(books);

  form.reset();
});
