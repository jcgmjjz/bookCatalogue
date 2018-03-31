let mongoose = require("mongoose");
let Book = require('../models/book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var request = require('superagent');

chai.use(chaiHttp);


describe('Books', () => {
  beforeEach((done) => { //Before each test empty the database
    Book.remove({}, (err) => { 
      done();         
    });     
  });


  /* Test the /GET route. This gets all the books in the catalogue. */
  describe('/GET localhost:3000/books', () => {
    it('it should GET all the books', (done) => {
      chai.request(server).get('/api/books')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  /* Test the /POST route. This will insert a book into the database */

  describe('/POST localhost:3000/books', () => {
    it('it should POST a book', (done) => {
      let book = {
        title : 'Funny Clowns',
        author : 'Bozo',
        numPages : 23
      };
      chai.request(server).post('/api/books')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(book)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('numPages');
        done();
      });
    });
  });

  /* Test the /Get id route. This will get a specific book by id. */
  describe('/GET/:id book', () => {
    it('it should GET a book by the given id', (done) => {
      let book = new Book({ title: "More Clowns", author: "Coco", numPages: 170 });
      book.save((err, book) => {
        chai.request(server).get('/api/books/' + book.id)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('author');
          res.body.should.have.property('numPages');
          res.body.should.have.property('_id').eql(book.id);
          done();
        });
      });

    });
  });


  describe('/PUT/:id book', () => {
    it('it should UPDATE a book given the id', (done) => {
      let book = new Book({title: "Other Clowns", author: "Bozo", numPages: 666})
      book.save((err, book) => {
        let changeBook = {
          title: "Funny Clowns",
          author: "Bozo",
          numPages: 23,
        };

        chai.request(server).put('/api/books/' + book.id).send(changeBook)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          //res.body.should.have.property('numPages');
          done();
        });
      });
    });
  });

  describe('/DELETE/:id book', () => {
    it('it should DELETE a book given the id', (done) => {
      let book = new Book({title: "Clowns Around the Town", author: "Smokey", numPages: 777})
      book.save((err, book) => {
        chai.request(server).delete('/api/books/' + book.id)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          done();
        });
      });
    });
  });

});

