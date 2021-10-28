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

  bookList.forEach((book, index) => {
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
