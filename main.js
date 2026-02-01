"user strict";

// array to store books
const books = [];

// id elements of the form
const form = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusSelect = document.getElementById("status");

// id of ul container
const bookList = document.getElementById("book-list");

// filter buttons
const filterButtons = document.querySelectorAll("button[data-filter]");

// stored books
const storedBooks = JSON.parse(localStorage.getItem("books"));

if (storedBooks) books.push(...storedBooks);

// we call it here again to re-render the already existing books
renderBooks(books);

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

  // adds book into books array
  books.push(newBook);

  // saves to local storage
  localStorage.setItem("books", JSON.stringify(books));

  // renders books into page
  renderBooks(books);

  // resets form
  form.reset();
});

// looping through the filter buttons
filterButtons.forEach(function (button) {
  // add click listeners to each button
  button.addEventListener("click", function () {
    // capture the value of the button
    const filterValue = button.dataset.filter;

    if (filterValue === "all") {
      renderBooks(books);
    } else {
      const filtered = books.filter((book) => book.status === filterValue);
      renderBooks(filtered);
    }
  });
});
