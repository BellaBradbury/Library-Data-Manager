var express = require('express');
var router = express.Router();
let sequelize = require('./models').sequelize;
const Book = require('./models').book;

// async handler
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(err){
      res.status(500).send(err);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler( async(req, res) => {
  const books = await Book.findAll();
  console.log(books);
}));

module.exports = router;
