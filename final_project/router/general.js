const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users[password] = { password };

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 2));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    return res.status(404).json({ message: "No books found for the given author "});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
    } else {
        return res.status(404).json({ message: "No books found for the given title."});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
    return res.status(404).json({ message: "No reviews found for the given ISBN" });
  }
});

module.exports.general = public_users;
