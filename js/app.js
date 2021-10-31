//Book constructor
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

//method/function that toggles a book’s read status on Book prototype instance.
Book.prototype.bookReadStatus = function (target) {
  if (this.read === "true") {
    this.read = "false";
  } else if (this.read === "false") {
    this.read = "true";
  }

  const readStatus = this.read === "true" ? "read" : "Not read";
  target.textContent = `${readStatus}`;
};

//get all books from local storage
function getBookFromstorage() {
  return JSON.parse(localStorage.getItem("books")) || [];
}
//store books in myLibrary
const myLibrary = getBookFromstorage();

//add methods to objects retrieved from localStorage
myLibrary.forEach((book) => {
  book.bookReadStatus = function (target) {
    if (this.read === "true") {
      this.read = "false";
    } else if (this.read === "false") {
      this.read = "true";
    }
    const readStatus = this.read === "true" ? "read" : "Not read";
    target.textContent = `${readStatus}`;
  };
});

//update books in local storage with books in myLibrary
function moveBookToStorage() {
  localStorage.setItem("books", JSON.stringify(myLibrary));
}

//define array that store books

//function that instantiate constructor and add book to list
function addBookToList(title, author, pages, readStatus) {
  const book = new Book(title, author, pages, readStatus);
  myLibrary.push(book);
  moveBookToStorage();
  displayBooks();
}

//loop throgh myLibrary array and display each book
function displayBooks() {
  //check for and remove existing book from page
  const tableBody = document.querySelector(".table-body");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  myLibrary.forEach((book, index) => {
    const readStatus = book.read === "true" ? "read" : "Not read";
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td><button class="btn read-btn" data-readstatusindex = "${index}">${readStatus}</button></td>
      <td><button class="btn delete-btn" data-bookindex = "${index}"><span class="material-icons delete-icon">delete</span></button></td>
      `;

    tableBody.append(tableRow);
  });
}

function grabFormFieldVAlues() {
  const form = document.querySelector("#form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    //grab HTML form fields
    const titleFied = form.elements["book-title"];
    const authorField = form.elements["book-author"];
    const pagesField = form.elements["book-pages"];
    const readStatusRadios = form.elements["read-status"];
    //grab the value of HTML form fields
    const bookTitle = titleFied.value;
    const bookAuthor = authorField.value;
    const bookPages = pagesField.value;
    //get the value of selected radio button
    function getReadStatus() {
      let selectedValue;
      readStatusRadios.forEach((radio) => {
        if (radio.checked) {
          selectedValue = radio.value;
        }
      });
      return selectedValue;
    }
    const readStatus = getReadStatus();
    //instantiate Book constructor
    addBookToList(bookTitle, bookAuthor, bookPages, readStatus);
    //clear input fields after adding each book
    resetInputFields(titleFied, authorField, pagesField);
  });
}

function resetInputFields(titleFied, authorField, pagesField) {
  titleFied.value = "";
  authorField.value = "";
  pagesField.value = "";
}

grabFormFieldVAlues();

function toggleBookReadStatus(target, instanceofBook) {
  if (target.tagName === "BUTTON" && target.classList.contains("read-btn")) {
    instanceofBook.bookReadStatus(target);
  }
}

const tableBody = document.querySelector(".table-body");
tableBody.addEventListener("click", (e) => {
  const target = e.target;
  toggleBookReadStatus(target, myLibrary[target.dataset.readstatusindex]);
  moveBookToStorage();
});

function deleteBook() {
  const tableBody = document.querySelector(".table-body");
  tableBody.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (target.classList.contains("delete-btn")) {
      myLibrary.splice(target.dataset.bookindex, 1);
      target.parentElement.parentElement.remove();
      // localStorage.setItem("books", JSON.stringify(myLibrary));
      // displayBooks();
    }
    moveBookToStorage();
    displayBooks();
  });
}
displayBooks();

deleteBook();
//search book in library by book title or author's name
const searchBox = document.querySelector(".search-box");
searchBox.addEventListener("keyup", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const books = tableBody.querySelectorAll("tr");
  books.forEach((book) => {
    const bookTitle = book.firstElementChild.textContent.toLowerCase();
    const bookAuthor =
      book.firstElementChild.nextElementSibling.textContent.toLowerCase();
    if (
      bookTitle.indexOf(searchTerm) !== -1 ||
      bookAuthor.indexOf(searchTerm) !== -1
    ) {
      book.style.visibility = "visible";
    } else {
      book.style.visibility = "collapse";
    }
  });
});

//sort displayed books by title, author or read status
function sortBooks() {
  const sortCriteria = document.querySelector(".sort-section");
  let sortTerm;
  sortCriteria.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === ("INPUT" || "LABEL") && target.checked) {
      sortTerm = target.value;
    }
    myLibrary.sort((x, y) => {
      const a = x[sortTerm];
      const b = y[sortTerm];
      return a === b ? 0 : a > b ? 1 : -1;
    });
    moveBookToStorage();
    displayBooks();
  });
}

sortBooks();

function openAddBookModal() {
  const addBookModalBtn = document.querySelector(".add-book-btn");
  addBookModalBtn.addEventListener("click", (e) => {
    const target = e.target;
    const addBookModal = document.querySelector(".input-book-detail-modal");

    addBookModal.classList.add("active");
  });
}

openAddBookModal();

function closeAddBookModal() {
  const addBookModal = document.querySelector(".input-book-detail-modal");
  addBookModal.addEventListener("click", (e) => {
    const target = e.target;
    const closeModalIcon = document.querySelector(".close-icon");
    if (target === addBookModal || target === closeModalIcon) {
      addBookModal.classList.remove("active");
    }
  });
}

closeAddBookModal();
