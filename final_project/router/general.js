const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
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
public_users.get('/', async function (req, res) {
    try {
      const responseData = { data: books };
      
      res.send(JSON.stringify(responseData.data));
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the list of books.');
    }
  });



// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //libros filtrados por isbn
  try {
      const isbn = req.params.isbn;
      res.send(books[isbn]);
    } catch (error){
        console.error(error);
        res.status(500).send('An error occurred while fetching the list of books.');
    }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try {  
        const author = req.params.author;
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        res.send(filteredBooks);
    } catch (error){
        console.error(error);
        res.status(500).send('An error occurred while fetching the list of books.');
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try {
      const title = req.params.title;
      const filteredBooks = Object.values(books).filter(book => book.title === title);
      return res.send(filteredBooks);
    } catch (error){
        console.error(error);
        res.status(500).send('An error occurred while fetching the list of books.');
    }    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;