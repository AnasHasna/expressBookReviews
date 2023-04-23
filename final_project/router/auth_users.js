const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (isValid(username)) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).json({ message: "Login Successful", accessToken });
    } else {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } else {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    let review = req.body.review;
    if (!review) {
      return res.status(300).json({ message: "Review is missing" });
    }
    book.reviews = review;
    console.log(book.reviews);
    return res.status(200).json({ review });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    book.reviews = null;
    return res.status(200).json({ message: "Review deleted" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
