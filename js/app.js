//get all books from local storage
function getBookFromstorage() {
  return JSON.parse(localStorage.getItem("books")) || [];
}
//store books in myLibrary
const myLibrary = getBookFromstorage();

//update books in local storage with books in myLibrary
function moveBookToStorage() {
  localStorage.setItem("books", JSON.stringify(myLibrary));
}

//define array that store books
const myLibrary = [];

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

//function that instantiate constructor and add book to list
function addBookToList(title, author, pages, readStatus) {
  const book = new Book(title, author, pages, readStatus);
  myLibrary.push(book);
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
      <td><button class="btn delete-btn" data-bookindex = "${index}">X</button></td>
      `;

    tableBody.append(tableRow);
  });
}

function grabFormFielVAlues() {
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
    displayBooks();
    //clear input fields after adding each book
    resetInputFields(titleFied, authorField, pagesField);
  });
}

function resetInputFields(titleFied, authorField, pagesField) {
  titleFied.value = "";
  authorField.value = "";
  pagesField.value = "";
}

grabFormFielVAlues();

function toggleBookReadStatus(target, instanceofBook) {
  if (target.tagName === "BUTTON" && target.classList.contains("read-btn")) {
    instanceofBook.bookReadStatus(target);
  }
}

const tableBody = document.querySelector(".table-body");
tableBody.addEventListener("click", (e) => {
  const target = e.target;
  toggleBookReadStatus(target, myLibrary[target.dataset.readstatusindex]);
  deleteBook(target);
});

function deleteBook(target) {
  if (target.classList.contains("delete-btn")) {
    //remove book from library
    myLibrary.splice(target.dataset.index, 1);
    //remove book from UI
    target.parentElement.parentElement.remove();
    //display current books in library
    displayBooks();
  }
}
