const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  // Create a new user
  const newUser = {
    username: username,
    password: password
  };

  // Save the new user in the users database
  users.push(newUser);

  // Return success response
  res.status(201).json({ message: 'User registered successfully, now you can login.' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Muestra los libros
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //libros filtrados por isbn
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //filtrar por nombre de autor
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  // Return the filtered books
  return res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //filtrar por titulo
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  // Return the filtered books
  return res.send(filteredBooks);

    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
