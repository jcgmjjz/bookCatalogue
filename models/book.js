var mongoose = require('mongoose');

var BookSchema = mongoose.Schema({
  "title" : String,
  "author" :  String,
  "numPages" : Number
  });

module.exports = mongoose.model('book', BookSchema);
