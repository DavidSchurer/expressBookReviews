const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required" });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });

  req.session.accessToken = token;

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" }); 
  }

  const token = req.session.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Access token is missing: Please log in." });
  }

  jwt.verify(token, "fingerprint_customer", (err, decoded) => {
    if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }

    const username = decoded.username;

    const book = books[isbn];
    if (!book) {
    return res.status(404).json({ message: "Book not found" });
    }

    if (book.reviews[username]) {
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review updated successfully", book });
    } else {
        book.review[username] = review;
        return res.status(201).json({ message: "Review added successgully", book });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
