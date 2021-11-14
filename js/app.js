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

//function that instantiate constructor and add book to list
function createNewBook(title, author, pages, readStatus) {
  const book = new Book(title, author, pages, readStatus);
  myLibrary.push(book);
  moveBookToStorage();
  displayBooks();
}

//update books in local storage with books in myLibrary
function moveBookToStorage() {
  localStorage.setItem("books", JSON.stringify(myLibrary));
}

//define array that store books

function displayBooks() {
  //check for and remove existing book from page
  const allLibraryBooks = document.querySelector(".content");
  console.log(allLibraryBooks.firstChild);
  while (allLibraryBooks.firstChild) {
    allLibraryBooks.removeChild(allLibraryBooks.firstChild);
  }
  myLibrary.forEach((book, index) => {
    const readStatus = book.read === "true" ? "read" : "Not read";
    const libraryBook = document.createElement("div");
    libraryBook.className = "row";
    libraryBook.innerHTML = `
    <div class="book-details">${book.title}</div>
    <div class="book-details">${book.author}</div>
    <div class="book-details">${book.pages}</div>
    <div><button class="btn read-book-status" data-readstatusindex = "${index}">${readStatus}</button></div>
    <div class="flex"><button class="btn edit-book-btn flex column" data-editbookindex = "${index}"><span class="material-icons-outlined delete-icon">edit</span>edit</button></div>
    <div class="flex"><button class="btn delete-book-btn flex column" data-bookindex = "${index}"><span class="material-icons-outlined delete-icon">delete</span>delete</button></div>
    `;

    allLibraryBooks.append(libraryBook);
  });
  console.log(allLibraryBooks.firstChild);
  readStatusColor();
}

function addBookToLibrary() {
  const form = document.querySelector("#form");
  form.addEventListener("submit", (e) => {
    const target = e.target;
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

    //  instantiate Book constructor
    validateFormFields(
      createNewBook,
      target,
      bookTitle,
      bookAuthor,
      bookPages,
      readStatus
    );
    // addBookToList(bookTitle, bookAuthor, bookPages, readStatus);

    //clear input fields after adding each book
    resetInputFields(titleField, authorField, pagesField);
  });
}

function resetInputFields(titleField, authorField, pagesField) {
  titleField.value = "";
  authorField.value = "";
  pagesField.value = "";
}

addBookToLibrary();

function toggleBookReadStatus(target, instanceofBook) {
  if (
    target.tagName === "BUTTON" &&
    target.classList.contains("read-book-status")
  ) {
    instanceofBook.bookReadStatus(target);
  }
}

const allLibraryBooks = document.querySelector(".content");
allLibraryBooks.addEventListener("click", (e) => {
  const target = e.target;
  toggleBookReadStatus(target, myLibrary[target.dataset.readstatusindex]);
  moveBookToStorage();
});

function deleteBook() {
  const allLibraryBooks = document.querySelector(".content");
  allLibraryBooks.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (target.classList.contains("delete-book-btn")) {
      myLibrary.splice(target.dataset.bookindex, 1);
      target.parentElement.remove();
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
  const books = allLibraryBooks.querySelectorAll(".row");
  console.log(books);
  books.forEach((book) => {
    const bookTitle = book.firstElementChild.textContent.toLowerCase();
    const bookAuthor =
      book.firstElementChild.nextElementSibling.textContent.toLowerCase();
    if (
      bookTitle.indexOf(searchTerm) !== -1 ||
      bookAuthor.indexOf(searchTerm) !== -1
    ) {
      book.style.display = "grid";
    } else {
      book.style.display = "none";
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
      let a = x[sortTerm];
      let b = y[sortTerm];
      a = a.toLowerCase();
      b = b.toLowerCase();
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
  } else if (target.classList.contains("new-book-btn")) {
    addBookForm.classList.remove("hide");
    editBookForm.classList.remove("active");
  }
}
function openAddBookModal() {
  const addBookModalBtn = document.querySelector(".new-book-btn");
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
  const allLibraryBooks = document.querySelector(".content");
  const editBookForm = document.querySelector(".edit-book-form");
  function getBookDetails(instanceofBook) {
    const titleField = editBookForm.elements["book-title"];
    const authorField = editBookForm.elements["book-author"];
    const pagesField = editBookForm.elements["book-pages"];
    instanceofBook.bookDetails(titleField, authorField, pagesField);
  }
  allLibraryBooks.addEventListener("click", (e) => {
    // const target = e.target;
    const target = e.target.closest("button");
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
//remove add book and edit book book modal on click of add to book button
//or save changes button
function removeModal() {
  const addBookModal = document.querySelector(".input-book-detail-modal");
  addBookModal.classList.remove("active");
}

//edit book deatails
function editBook() {
  const editBookForm = document.querySelector(".edit-book-form");
  editBookForm.addEventListener("submit", (e) => {
    const target = e.target;
    e.preventDefault();
    //grab HTML form fields
    const titleField = editBookForm.elements["book-title"];
    const authorField = editBookForm.elements["book-author"];
    const pagesField = editBookForm.elements["book-pages"];
    const readStatusRadios = editBookForm.elements["edit-form-read-status"];
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
    function setBookDetails(instanceofBook) {
      instanceofBook.modifyBookDetails(
        titleField,
        authorField,
        pagesField,
        readStatus
      );
    }
    validateFormFields(
      setBookDetails,
      target,
      bookTitle,
      bookAuthor,
      bookPages
    );
    // setBookDetails(myLibrary[objindex]);
    moveBookToStorage();
    displayBooks();
  });
}

editBook();
//validate form fields before adding book to library or editing existing book in library
function validateFormFields(
  fun,
  formType,
  bookTitle,
  bookAuthor,
  bookPages,
  readStatus
) {
  const errorMessages = formType.querySelectorAll(".error-message");
  if (bookTitle === "" || bookAuthor === "" || bookPages === "") {
    errorMessages.forEach((message) => {
      if (message.nextElementSibling.value === "") {
        message.textContent = `${message.dataset.fielderrormessage} `;
        message.style.display = "block";
        message.nextElementSibling.style.borderColor = "#fa9a9a";
        message.nextElementSibling.style.borderStyle = "solid";
      }
    });
    return;
  } else {
    errorMessages.forEach((message) => {
      message.style.display = "none";
      //message.nextElementSibling.style.borderColor = "no";
      message.nextElementSibling.style.borderStyle = "#e2daeb";
    });
    if (formType.classList.contains("add-book-form")) {
      fun(bookTitle, bookAuthor, bookPages, readStatus);
    } else if (formType.classList.contains("edit-book-form")) {
      fun(myLibrary[objindex]);
    }
    removeModal();
  }
}

function readStatusColor() {
  const readStatusBtns = document.querySelectorAll(".read-book-status");
  readStatusBtns.forEach((readStatusBtn) => {
    if (readStatusBtn.textContent === "read") {
      readStatusBtn.style.backgroundColor = "#9beb9b";
    } else {
      readStatusBtn.style.backgroundColor = "#fa9a9a";
    }
  });
}

readStatusColor();
