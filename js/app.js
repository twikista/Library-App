let objindex = null;

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

Book.prototype.bookDetails = function (bookTitle, bookAuthor, bookPages) {
  bookTitle.value = this.title;
  bookAuthor.value = this.author;
  bookPages.value = this.pages;
};

Book.prototype.modifyBookDetails = function (bookTitle, bookAuthor, bookPages) {
  this.title = bookTitle.value;
  this.author = bookAuthor.value;
  this.pages = bookPages.value;
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
  book.bookDetails = function (bookTitle, bookAuthor, bookPages) {
    bookTitle.value = this.title;
    bookAuthor.value = this.author;
    bookPages.value = this.pages;
  };
  book.modifyBookDetails = function (
    bookTitle,
    bookAuthor,
    bookPages,
    readStatus
  ) {
    this.title = bookTitle.value;
    this.author = bookAuthor.value;
    this.pages = bookPages.value;
    this.read = readStatus;
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
      <td><button class="btn edit-book-btn" data-editbookindex = "${index}">Edit</button></td>
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
    const titleField = form.elements["book-title"];
    const authorField = form.elements["book-author"];
    const pagesField = form.elements["book-pages"];
    const readStatusRadios = form.elements["read-status"];
    //grab the value of HTML form fields
    const bookTitle = titleField.value;
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
    // if (
    //   target.lastElementChild.previousElementSibling.classList.contains(
    //     "add-book-btn"
    //   )
    // ) {
    //   //instantiate Book constructor
    //   console.log("hey");
    //   addBookToList(bookTitle, bookAuthor, bookPages, readStatus);
    // } else if (target.lastElementChild.classList.contains("save-btn")) {
    //   console.log("i am");
    //   console.log(target);
    // function setBookDetails(instanceofBook, clickBtn) {
    //   instanceofBook.bookDetails(
    //     titleField,
    //     authorField,
    //     pagesField,
    //     clickBtn
    //   );
    // }
    // const clickBtn = target.lastElementChild;
    // setBookDetails(myLibrary[objindex], clickBtn);
    // }
    //  instantiate Book constructor
    addBookToList(bookTitle, bookAuthor, bookPages, readStatus);

    //clear input fields after adding each book
    resetInputFields(titleField, authorField, pagesField);
  });
}

function resetInputFields(titleField, authorField, pagesField) {
  titleField.value = "";
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

function switchFormSubmitButton(target) {
  const editBookForm = document.querySelector(".edit-book-form");
  const addBookForm = document.querySelector(".add-book-form");
  if (target.classList.contains("edit-book-btn")) {
    addBookForm.classList.add("hide");
    editBookForm.classList.add("active");
  } else if (target.classList.contains("add-book-btn")) {
    addBookForm.classList.remove("hide");
    editBookForm.classList.remove("active");
  }
}
function openAddBookModal() {
  const addBookModalBtn = document.querySelector(".add-book-btn");
  const titleField = form.elements["book-title"];
  const authorField = form.elements["book-author"];
  const pagesField = form.elements["book-pages"];
  addBookModalBtn.addEventListener("click", (e) => {
    resetInputFields(titleField, authorField, pagesField);
    const target = e.target;
    const addBookModal = document.querySelector(".input-book-detail-modal");
    switchFormSubmitButton(target);
    addBookModal.classList.add("active");
  });
}

openAddBookModal();

function openEditBookModal() {
  const tableBody = document.querySelector(".table-body");
  const editBookForm = document.querySelector(".edit-book-form");
  function getBookDetails(instanceofBook) {
    const titleField = editBookForm.elements["book-title"];
    const authorField = editBookForm.elements["book-author"];
    const pagesField = editBookForm.elements["book-pages"];
    instanceofBook.bookDetails(titleField, authorField, pagesField);
  }
  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("edit-book-btn")) {
      getBookDetails(myLibrary[target.dataset.editbookindex]);
      objindex = myLibrary.indexOf(myLibrary[target.dataset.editbookindex]);
      const addBookModal = document.querySelector(".input-book-detail-modal");
      switchFormSubmitButton(target);
      addBookModal.classList.add("active");
    }
  });
}

openEditBookModal();

function closeAddBookModal() {
  const addBookModal = document.querySelector(".input-book-detail-modal");
  addBookModal.addEventListener("click", (e) => {
    const target = e.target;
    const closeAddBookModalIcon = document.querySelector(
      ".add-book-form .close-icon"
    );
    const closeEditBookModalIcon = document.querySelector(
      ".edit-book-form .close-icon"
    );
    if (
      target === addBookModal ||
      target === closeAddBookModalIcon ||
      target === closeEditBookModalIcon
    ) {
      addBookModal.classList.remove("active");
    }
  });
}

closeAddBookModal();

function editBook() {
  const saveBtn = document.querySelector("save-btn");
  const editBookForm = document.querySelector(".edit-book-form");

  editBookForm.addEventListener("submit", (e) => {
    const target = e.target;
    e.preventDefault();
    console.log("saved!");
    //grab HTML form fields
    const titleField = editBookForm.elements["book-title"];
    const authorField = editBookForm.elements["book-author"];
    const pagesField = editBookForm.elements["book-pages"];
    const readStatusRadios = editBookForm.elements["read-status"];
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
    console.log(target);
    function setBookDetails(instanceofBook) {
      instanceofBook.modifyBookDetails(
        titleField,
        authorField,
        pagesField,
        readStatus
      );
    }
    setBookDetails(myLibrary[objindex]);
    moveBookToStorage();
    displayBooks();
  });
}

editBook();
