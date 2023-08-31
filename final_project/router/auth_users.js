const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "username":"test",
    "password":"test1234"
}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)});
  if(validusers.length > 0){
    return true;} 
    else {
        return false;}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {

      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review; // Get review text from query parameter
    const username = req.session.authorization.username; // Get username from session
  
    if (!isbn || !reviewText) {
      return res.status(400).json({ message: "ISBN and review text are required." });
    }
  
    // Find the user in the users array
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      // Find the book in the books object
      const book = books[isbn];
      
      if (book) {
        // Find existing review by the same user for the same ISBN
        const existingReview = book.reviews[username];
  
        if (existingReview) {
          // Update existing review
          book.reviews[username] = reviewText;
        } else {
          // Add new review for the user
          book.reviews[username] = reviewText;
        }
  
        return res.status(200).json({ message: "Review added/modified successfully." });
      } else {
        return res.status(404).json({ message: "Book not found." });
      }
    } else {
      return res.status(401).json({ message: "User not authorized." });
    }

  });
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Get username from session
  
    // Find the user in the users array
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      // Find the book in the books object
      const book = books[isbn];
  
      if (book) {
        // Check if the user has an existing review for the book
        if (book.reviews[username]) {
          // Delete the user's review
          delete book.reviews[username];
          return res.status(200).json({ message: "Review deleted successfully." });
        } else {
          return res.status(404).json({ message: "Review not found for this user and book." });
        }
      } else {
        return res.status(404).json({ message: "Book not found." });
      }
    } else {
      return res.status(401).json({ message: "User not authorized." });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
