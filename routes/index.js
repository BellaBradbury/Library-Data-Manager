var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var pug = require('pug');
const Book = require('../models').Book;

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
  res.redirect('/books');
}));

// ROUTES
router.get( '/books', asyncHandler( async(req, res) => {
  const books = await Book.findAll();
  res.render( 'index', { library: books, title: 'Books' } );
}));
router.get( '/books/new', asyncHandler( async(req, res) => {
  res.render('new-book', {title: 'New Book'});
}));
router.post( '/books/new', asyncHandler( async(req, res) => {

}));
router.get( '/books/:id', asyncHandler( async(req, res) => {
  const index = req.params.id;
  res.render( 'update-book', { project: data.projects[index], title: 'Update Book' } );
}));
router.post( '/books/:id', asyncHandler( async(req, res) => {

}));
router.post( '/books/:id/delete', asyncHandler( async(req, res) => {

}));

// ERROR ROUTES
router.get('/page-not-found', (req, res) => {
  res.render('page-not-found', {title: 'Page Not Found'});
});
router.get('/error', (req, res) => {
  res.render('error', {title: 'Page Not Found'});
});
module.exports = router;
