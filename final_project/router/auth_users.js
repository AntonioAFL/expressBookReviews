const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let user = users.filter(user => user.username.toLowerCase() == username.toLowerCase());

    return user.length == 0 ? true : false;
}

const authenticatedUser = (username,password)=>{ 
    let validUser = users.filter((user) => {
        return user.username.toLowerCase() === username.toLowerCase() && user.password === password
    });

    return validUser.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if(authenticatedUser(username, password)) {

        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60*60});

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send({message: "Successfully Loged In"})
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.body.username;
    const review = req.body.review;

    books[ISBN].reviews[username] = review;

    return res.send({message: "Review successully updated"});
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.body.username;

    delete books[ISBN].reviews[username];

    return res.send({message: "Your review was successfully deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
