
import chai = require('chai');
import chaiHttp = require('chai-http');
import Database from '../config/db'
import { ExpenseModel } from '../models/expense.model'
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || 4000
const SERVER_URL = `${BASE_URL}:${PORT}/api/v1`

const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/mydb`


let should = chai.should();


chai.use(chaiHttp);

new Database(MONGO_URL).connectDataBase()


describe('Expenses', () => {
  
  
  beforeEach((done) => {
    ExpenseModel.deleteMany({}, (err) => {
      done();
    });
  });

  // / test GET expenses route
  describe('/GET expenses', () => {
    it('it should GET all the expenses', (done) => {
      chai.request(SERVER_URL)
        .get('/expenses')
        .end((err: any, res: any) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });



  // /test POST expenses with validation error 
  describe('/POST expense', () => {
    it('it should not POST an expense without title field', (done) => {
      let expense = {
        category: "Transport",
        cost: 20
      }
      chai.request(SERVER_URL)
        .post('/expenses')
        .send(expense)
        .end((err: any, res: any) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });

  });


  // /test POST expenses route without any validation errors
  describe('/POST expense', () => {
    it('it should POST an expense', (done) => {
      let expense = {
        category: "Transport",
        title: "bus ticket",
        cost: 10
      }
      chai.request(SERVER_URL)
        .post('/expenses')
        .send(expense)
        .end((err: any, res: any) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('category');
          res.body.should.have.property('title');
          res.body.should.have.property('cost');
          res.body.should.have.property('time');

          done();
        });
    });



  });



  



  // /GET expenses/:id route
  describe('/GET/:id expense', () => {
    it('it should GET an expense with the given id', (done) => {

      let model = new ExpenseModel({
        category: "Transport",
        title: "bus ticket",
        cost: 40
      });
      model.save((err, expense) => {
        chai.request(SERVER_URL)
          .get('/expenses/' + expense.id)
          .send(expense)
          .end((err: any, res: any) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('category');
            res.body.should.have.property('title');
            res.body.should.have.property('cost');
            res.body.should.have.property('time');
            res.body.should.have.property('id').eql(expense.id);
            done();
          });
      });

    });
  })



// /PATCH expenses/:id update expense
  describe('/PATCH/:id expense', () => {
    it('it should UPDATE an expense with the given id', (done) => {
      let model = new ExpenseModel({
        category: "Entertainment",
        title: "movie night",
        cost: 20
      });
      model.save((err, expense) => {
              chai.request(SERVER_URL)
              .patch('/expenses/' + expense.id)
              .send({title: "PS5 Game"})
              .end((err:any, res:any) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql("PS5 Game");
                done();
              });
        });
    });
});


   // /DELETE expenses/:id route
   describe('/DELETE/:id expense', () => {
    it('it should DELETE an expense with the given id', (done) => {

      let model = new ExpenseModel({
        category: "Transport",
        title: "bus ticket",
        cost: 40
      });
      model.save((err, expense) => {
        chai.request(SERVER_URL)
          .delete('/expenses/' + expense.id)
          .end((err: any, res: any) => {
            res.should.have.status(204)
            done();
          });
      });

    });
  })





});


