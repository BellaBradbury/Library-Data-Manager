let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let Sequelize = require('sequelize');
let sqlite = require('sqlite3');
let pug = require('pug');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

// connect & sync database
( async() => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connection successful!");
  } catch (err) {
    console.log("There has been a database connection error:", err);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use( '/static', express.static('public') );

// ERROR HANDLING
app.use( (req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "Whoops! The page you're looking for doesn't exist.";
  console.log(err.status, err.message);
  res.redirect("/page-not-found");
  next(err);
});
app.use( (err, req, res, next) => {
  if (err.status !== 404) {
    err.status = 500;
    err.message = "Something has gone wrong, please try again!";
    console.log(err.status, err.message);
    res.redirect('/error');
  }
});

// PAGINATION HANDLING
const getPagination = (page, size) => {
  const limit = size ? + size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}

getPagingData = (data, page, limit) => {
  const { count: totalBooks, rows: allBooks} = data;
  const currentPage = page ? + page : 0;
  const totalPages = Math.ceil(totalBooks / limit);

  return { totalBooks, allBooks, totalPages, currentPage };
}

exports.findAll = (req, res) => {
  const {page, size} = req.query;
  const {limit, offset} = getPagination(page,size);

  Book.findAndCountAll({ where: limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    });
};

module.exports = app;
