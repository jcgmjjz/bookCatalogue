var express = require('express');
var router = express.Router();

let mongoose = require('mongoose');
let Book = require('../models/book');    // import the schema from models

// get a list of all the books
// get localhost:3000/books
router.get('/', function(req, res, next) {
  Book.find(function(err,books){
    if(err)return console.error(err);
    res.json(books);
  })
});

// get a specific book by id
// localhost:3000/books/5aad8814b562004ae03fc400
router.get('/:id', function(req, res, next) {
  Book.findOne({_id: req.params.id}, function(err, book) {
    if (err) return next(err);
    res.status(200).send(book);
  });
});

// Add a book to the collection
// post localhost:3000/books?author=bozou2&numPages=33
router.post('/', function(req, res, next) {

  let bookToCreate = new Book(req.body);

  bookToCreate.save(function(err, book){
    if(err) {
      console.log('post error saving to mongodb');
      return console(err);
    }
    res.status(200).send(book);
  });
});

// update the date for a specific book
// localhost:3000/books/5aadbe2ef0851460ac5891e2?title=clowns&author=bozo&numPages=100
router.put('/:id', function(req, res, next) {
  Book.findOneAndUpdate({_id: req.params.id}, req.body, function(err, book) {
    if (err) return next(err);
    res.status(204).send(book);
  });
});

// delete a book from the collection
// localhost:3000/books/5aac8952aef4ac23dc115173
router.delete('/:id', function(req, res, next) {
  Book.deleteOne({_id: req.params.id}, function(err, book) {
     if (err) return next(err);
     res.status(204).send();
  });
});

module.exports = router;

