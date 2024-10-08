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
public_users.get('/', async function (req, res) {
    try {
        
        const bookList = await new Promise((resolve) => {
            resolve(JSON.stringify(books));
        });
        
        return res.send(bookList);
    } catch (error) {
        return res.status(500).send({ message: "Error retrieving book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;

    return new Promise((resolve, reject) => {
        if (books[ISBN]) {
            resolve(books[ISBN]); 
        } else {
            reject(new Error('Book not found')); 
        }
    })
    .then(bookDetails => {
        return res.send(bookDetails); 
    })
    .catch(error => {
        console.error(error);
        return res.status(404).send({ message: error.message }); 
    });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    return new Promise((resolve, reject) => {
        
        let filterByAuthor = Object.values(books).filter(book => book.author === author);

        if (filterByAuthor.length > 0) {
            resolve(filterByAuthor); 
        } else {
            reject(new Error('No books found for this author')); 
        }
    })
    .then(filteredBooks => {
        return res.send(filteredBooks); 
    })
    .catch(error => {
        console.error(error);
        return res.status(404).send({ message: error.message }); 
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    return new Promise((resolve, reject) => {
        
        let filterByTitle = Object.values(books).filter(book => book.title === title);

        if (filterByTitle.length > 0) {
            resolve(filterByTitle); 
        } else {
            reject(new Error('No books found with this title')); 
        }
    })
    .then(filteredBooks => {
        return res.send(filteredBooks); 
    })
    .catch(error => {
        console.error(error);
        return res.status(404).send({ message: error.message }); 
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    return res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
