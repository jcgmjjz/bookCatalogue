var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
let Book = require('./models/book');    // import the schema from models

mongoose.connect('mongodb://heroku_dk9gqdh0:g44hlper8aju8g6849k2432e7q@ds231229.mlab.com:31229/heroku_dk9gqdh0');

//mongoose.connect('mongodb://localhost/test');
/******* For Mustache *************/
mustacheExpress = require('mustache-express');  // Logic-less {{mustache}} templates
/*********** End mustache *************/

var books = require('./routes/books');   // This is where the routes will be placed

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/******* For Mustache *************/
// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
/*********** End mustache *************/

app.use('/api/books', books);

// GET front page, table of all books
app.get('/', function (req, res) {
  Book.find(function(err,books){
    if(err)return console.error(err);
    res.render('index', {books: books, bookstable: true, singlebook: false, newBook: false})
  });
 });

// GET Insert new book page
app.get('/newBook', function (req, res) {
    res.render('index', { bookstable: false, singlebook: false, newBook: true})
  });

// localhost:3000/books/5aad8814b562004ae03fc400
// GET individual book by catalogue id. Linked from front page
app.get('/:id', function(req, res, next) {
  Book.findOne({_id: req.params.id}, function(err, book) {
    if (err) return next(err);
      res.render('index', {bookstable: false, singlebook: true, newBook: false, book: book});
    });
  });

// localhost:3000/books/5aac8952aef4ac23dc115173
// POST delete book from individual book page
app.post('/:id/delete', function(req, res, next) {
  console.log('POST DELETE');
  console.log(req.params["id"]);
  Book.deleteOne({_id: req.params.id}, function(err, book) {
    console.log(req.params.id);
    if (err) return next(err);
      res.render('index', {bookstable: false, singlebook: true, newBook: false, book: book});
    });
  });

// localhost:3000/books/5aac8952aef4ac23dc115173
// POST update book from individual book page
app.post('/:id/update', function(req, res, next) {
  console.log('POST UPDATE');
  console.log(req.body);
  Book.findOneAndUpdate({_id: req.params.id}, req.body, function(err, book) {
    if (err) return next(err);
      res.render('index', {bookstable: false, singlebook: true, newBook: false, book: book});
    });
  });

// Add a book to the collection
// post localhost:3000/books?author=bozou2&numPages=33
app.post('/new', function(req, res, next) {
  let bookToCreate = new Book(req.body);
  bookToCreate.save(function(err, book){
    if(err) {
      console.log('post error saving to mongodb');
      return console(err);
    }
    res.render('index', {bookstable: false, singlebook: false, newBook: true, book: book});
  });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
