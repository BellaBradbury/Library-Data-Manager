let express = require('express');
let router = express.Router();
const {Op} = require('sequelize')
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

// HOME PAGE ROUTES
router.get('/', asyncHandler( async(req, res) => {
  res.redirect('/books');
}));
router.get( '/books', asyncHandler( async(req, res) => {
    let { searchInput } = req.query;

    if (searchInput) {
      const rows = await Book.findAll({
        where: {
          [Op.or]: {
            title: { [Op.like]: `%${searchInput}%`},
            author: { [Op.like]: `%${searchInput}%`},
            genre: { [Op.like]: `%${searchInput}%`},
            year: { [Op.like]: `%${searchInput}%`}
          }
        }
      });

      const bookResults = rows;

      res.render( 'index', {library: bookResults, title: 'Books'} );
    } else {
      await Book.findAndCountAll({
        offset: req.query.page ? Number(req.query.page - 1) * 5 : 0,
        limit: 5
      }).then(books => {
        res.render('index', {library: books.rows, pages: Number(books.count / 5), title: 'Books'});
      });
    }
}));


// CREATE NEW BOOK
router.get( '/books/new', asyncHandler( async(req, res) => {
  res.render( 'new-book', {book: {}, title: 'New Book'} );
}));
router.post( '/books/new', asyncHandler( async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: 'New Book'});
    } else {
      throw error;
    }
  }
}));

  // UPDATE INDIVIDUAL BOOK
router.get( '/books/:id', asyncHandler( async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render( 'update-book', { book, title: 'Update Book' } );
}));
router.post( '/books/:id', asyncHandler( async(req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books');
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('update-book', { book, errors: error.errors, title: 'Update Book'});
    } else {
      throw error;
    }
  }
}));

// DELETE INDIVIDUAL BOOK
router.post( '/books/:id/delete', asyncHandler( async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

// ERROR ROUTES
router.get('/page-not-found', (req, res) => {
  res.render('page-not-found', {title: 'Page Not Found'});
});
router.get('/error', (req, res) => {
  res.render('error', {title: 'Page Not Found'});
});
module.exports = router;
