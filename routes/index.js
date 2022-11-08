var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

// import book model
const Book = require('.../models/book.js');

Book.findAll().then( (books) => {
  console.log("sucess");
})

/* GET home page. */
router.get('/', function(req, res, next) {
  ( async() => {
    const books = await Book.findAll();
    return map(books).then( res => res.json() );
  });
});

module.exports = router;
