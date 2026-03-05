"use strict";

// array to store books
let books = [];

// holding the current state of sorting
let currentSort = "title";
let currentSortDirection = "asc";

let currentSearch = "";
let currentFilter = "all";

// will hold the id of the book thats being edited
let editingBookID = null;

// id elements of the form
const form = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusSelect = document.getElementById("status");

// getting the select option for sorting the books
const sortingSelect = document.getElementById("sorting-books");

const sortDirectionBtn = document.getElementById("sort-direction");

// the form submit button
const formSubmitButton = form.querySelector("button[type='submit']");

// id of ul container
const bookList = document.getElementById("book-list");

// search bar
const searchInput = document.getElementById("search-bar");

// filter buttons
const filterButtons = document.querySelectorAll("button[data-filter]");

// stored books
const storedBooks = JSON.parse(localStorage.getItem("books"));

if (storedBooks) books.push(...storedBooks);

// stored state
const savedState = JSON.parse(localStorage.getItem("uiState"));

// updating state based on what's restored
currentFilter = savedState?.filter ?? "all";
currentSort = savedState?.sort ?? "title";
currentSortDirection = savedState?.direction ?? "asc";
currentSearch = savedState?.search ?? "";
searchInput.value = currentSearch;
sortingSelect.value = currentSort;

// calling sortBooks here so the sorted books (if selected) appear here
displayBooks();

updateSubmitState();

// display added books to page
function renderBooks(booksArray) {
  booksArray.forEach(function (book) {
    // creating the li element
    let list = document.createElement("li");

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerText = "Remove";

    // edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerText = "Edit";

    // setting it's html data-id
    list.dataset.id = book.id;

    // giving the list its values
    list.textContent = `${book.title} - ${book.author} - ${book.status}`;

    bookList.appendChild(list);
    list.appendChild(deleteBtn);
    list.appendChild(editBtn);
  });
}

// as the name suggests it updates the state of the submit btn in the form
function updateSubmitState() {
  let titleValid = titleInput.value.trim() !== "";
  let authorValid = authorInput.value.trim() !== "";
  formSubmitButton.disabled = !(titleValid && authorValid);
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

  // stores Normalization for the book
  const normalizedTitle = newBook.title.toLowerCase().trim();

  const isDuplicate = books.some((book) => book.title.toLowerCase().trim() === normalizedTitle);
  // If the book already exists, don't push it
  if (isDuplicate) {
    alert("Title already exists");
    return;
  }

  // adds book into books array
  books.push(newBook);

  // saves to local storage
  localStorage.setItem("books", JSON.stringify(books));

  // resets form
  form.reset();
  updateSubmitState();
});

// ------- SORTING ---------------------------------
sortingSelect.addEventListener("change", function (e) {
  // updates the current sorted value so it stays
  currentSort = e.target.value;
  saveUIState();
  displayBooks();
});

//  sorting direction button
sortDirectionBtn.addEventListener("click", function () {
  // toggling the button from asc to desc
  if (currentSortDirection === "asc") {
    currentSortDirection = "desc";
  } else {
    currentSortDirection = "asc";
  }

  saveUIState();
  displayBooks();
});
// -------------------------------------------------

// title input listener if the field is empty
titleInput.addEventListener("input", updateSubmitState);

// author input listener if the field is empty
authorInput.addEventListener("input", updateSubmitState);

// looping through the filter buttons
filterButtons.forEach(function (button) {
  // add click listeners to each button
  button.addEventListener("click", function () {
    // capture the value of the button
    currentFilter = button.dataset.filter;
    saveUIState();
    displayBooks();
  });
});

// SEARCH BAR ------------------------------
searchInput.addEventListener("input", function (event) {
  // grab user input and normalize it
  currentSearch = event.target.value.toLowerCase().trim();
  saveUIState();
  displayBooks();
});
// ----------------------------------

// delete button / edit button
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
    displayBooks();
  } else if (event.target.matches(".edit-btn")) {
    const li = event.target.closest("li");

    const id = Number(li.dataset.id);

    // this will check wether theres a book thats been editing or not
    if (editingBookID !== null) return;

    // asigning the id of the clicked book
    editingBookID = id;

    // to get hold of the book inside the li element
    const foundBook = books.find((book) => book.id === id);

    li.innerHTML = `
      <input class="title-input" type="text" value="${foundBook.title}"> -
      <input class="author-input" type="text" value="${foundBook.author}">
      <select class="status-field">
      <option>${foundBook.status}</option>
        <option value="Read">Read</option>
        <option value="Own">Own</option>
        <option value="Wishlist">Wishlist</option>
        <option value="Reading">Currently Reading</option>
      </select>
      `;

    // focuses on the first field which is title
    const titleField = li.querySelector(".title-input");

    // save button
    const saveBtn = document.createElement("button");
    saveBtn.classList.add("save-btn");
    saveBtn.innerText = "Save";

    // cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-btn");
    cancelBtn.innerText = "Cancel";

    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);

    // focuses and selects the entire text on the input field title
    titleField.focus();
    titleField.select();
  } else if (event.target.matches(".save-btn")) {
    const li = event.target.closest("li");
    const id = Number(li.dataset.id);
    const foundBook = books.find((book) => book.id === id);

    // update the values with the new ones
    foundBook.title = li.querySelector(".title-input").value;
    foundBook.author = li.querySelector(".author-input").value;
    foundBook.status = li.querySelector(".status-field").value;

    // update books
    localStorage.setItem("books", JSON.stringify(books));

    // restoring the value so the state is back to normal
    editingBookID = null;

    // render the new content
    displayBooks();
  } else if (event.target.matches(".cancel-btn")) {
    // restoring the value so the state is back to normal
    editingBookID = null;

    // render back the original book
    displayBooks();
  }
});

// displayBooks is a single pipeline which every action to display
// sort, filter, search will be decided here, so not all functions
// are everywhere and it gets messy later on
function displayBooks() {
  let result = [...books];

  // search
  // filter through books array
  if (currentSearch) {
    result = result.filter((book) => book.title.toLowerCase().trim().includes(currentSearch) || book.author.toLowerCase().trim().includes(currentSearch));
  }

  // filter
  if (currentFilter !== "all") {
    result = result.filter((book) => book.status === currentFilter);
  }

  // sort and direction sorting
  result.sort((a, b) => (currentSortDirection === "asc" ? (a[currentSort] ?? "").localeCompare(b[currentSort] ?? "") : (b[currentSort] ?? "").localeCompare(a[currentSort] ?? "")));

  bookList.textContent = "";

  // creating the li element that will display the message if theres no books or matching books
  const displayNoBooksMsg = document.createElement("li");
  displayNoBooksMsg.classList.add("no-books-display-msg");

  const displayedMsg = document.createElement("p");

  // displays the message below if there are no books displayed
  if (!books.length) {
    displayedMsg.textContent = "Let's add our first book!";

    displayNoBooksMsg.appendChild(displayedMsg);
    bookList.appendChild(displayNoBooksMsg);
    return;
  } else if (!result.length) {
    displayedMsg.textContent = "No books found. ¯_(ツ)_/¯";

    displayNoBooksMsg.appendChild(displayedMsg);
    bookList.appendChild(displayNoBooksMsg);
    return;
  } else {
    renderBooks(result);
    updateActiveUI();
  }
}

// updates UI based on state
function updateActiveUI() {
  // looping through the filter buttons
  filterButtons.forEach(function (button) {
    if (button.dataset.filter === currentFilter) {
      button.classList.add("active-filter-btn");
    } else {
      button.classList.remove("active-filter-btn");
    }
  });

  // updates the button based on it's state
  if (currentSortDirection === "asc") {
    sortDirectionBtn.textContent = "Asc";
  } else {
    sortDirectionBtn.textContent = "Desc";
  }
}

// ------------------- saves UI state to local storage ------------------

function saveUIState() {
  let uiState = {
    filter: currentFilter,
    sort: currentSort,
    direction: currentSortDirection,
    search: currentSearch,
  };

  localStorage.setItem("uiState", JSON.stringify(uiState));
}
// ---------------------------------------------------------------------
