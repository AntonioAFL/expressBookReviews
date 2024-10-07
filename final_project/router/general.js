const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username.split(" ").join("");
    const password = req.body.password.split(" ").join("");

    if(isValid(username)) {

        if (username === "") return res.send({message: "Username not provided"})
        if (password === "") return res.send({message: "Password not provided"}) 

        users.push({
            'username': username,
            'password': password
        })
        
        return res.send({message: "Successful Registration"});

    } else {
        return res.send({message: "Username already taken"})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    return res.send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filterByAuthor = Object.values(books).filter(book => book.author == author);
    return res.send(filterByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filterByTitle = Object.values(books).filter(book => book.title == title);
    return res.send(filterByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    return res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
