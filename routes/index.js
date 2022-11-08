var express = require('express');
var router = express.Router();

const Book = require('../models/book.js').db;

/* GET home page. */
router.get('/', function(req, res, next) {
  ( async() => {
    const books = await Book.findAll();
  })
});

module.exports = router;
