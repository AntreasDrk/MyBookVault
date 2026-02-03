"user strict";

// array to store books
let books = [];

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
    // creating the li element
    let list = document.createElement("li");

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "Remove";

    // edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = "Edit";

    // setting it's html data-id
    list.dataset.id = book.id;

    // giving the list its values
    list.innerHTML = `${book.title} - ${book.author} - ${book.status}`;

    bookList.appendChild(list);
    list.appendChild(deleteBtn);
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

// delete button for all the books
bookList.addEventListener("click", function (event) {
  if (event.target.matches(".delete-btn")) {
    // finds the nearest parent (li)
    const li = event.target.closest("li");

    // converts the id to a number
    const id = Number(li.dataset.id);

    // filters through the books that do not match the id
    books = books.filter((book) => book.id !== id);

    // sents them to localStorage (the updated Array)
    localStorage.setItem("books", JSON.stringify(books));

    // renders the books
    renderBooks(books);
  }
});
