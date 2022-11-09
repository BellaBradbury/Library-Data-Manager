var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require('sequelize');
var sqlite = require('sqlite3');
var pug = require('pug');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
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

module.exports = app;
