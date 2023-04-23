const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(300).json({ message: "Username or Password is missing" });
  }
  if (isValid(username)) {
    return res.status(300).json({ message: "Username already exists" });
  } else {
    users.push({ username: username, password: password });
    console.log(users);
    return res.status(200).json({ message: "Registration Successful" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  console.log(book);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(300).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;

  let book = Object.values(books).filter((book) => {
    return book.author === author;
  });
  if (book.length > 0) {
    return res.status(200).json(book);
  } else {
    return res.status(300).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book = Object.values(books).filter((book) => {
    return book.title === title;
  });
  if (book.length > 0) {
    return res.status(200).json(book);
  } else {
    return res.status(300).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(300).json({ message: "Book not found" });
});

module.exports.general = public_users;
