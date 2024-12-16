const express = require('express');
const axios = require('axios');
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

public_users.get('/books-promise', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    })

    .then((bookList) => {
        res.status(200).send(JSON.stringify(bookList, null, 2));
    })
    .catch((err) => {
        res.status(500).json({ message: "Error fetching books", error: err.message });
    });
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

 // Get book details based on ISBN (Promise Callbacks)
 public_users.get('/isbn-promise/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    })
    .then((book) => {
        res.status(200).send(JSON.stringify(book, null, 2));
    })
    .catch((err) => {
        res.status(404).json({ message: err });
    });
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

// Get book details based on author (Promise Callbacks)
public_users.get('/author-promise/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found for the given author");
        }
    })
    .then((books) => {
        res.status(200).send(JSON.stringify(books, null, 2));
    })
    .catch((err) => {
        res.status(404).json({ message: err});
    });
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

// Get all books based on title (Promise Callbacks)
public_users.get('/title-promise/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found for the given title.");
        }
    })
    .then((books) => {
        res.status(200).send(JSON.stringify(books, null, 2));
    })
    .catch((err) => {
        res.status(200).json({ message: err });
    });
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
