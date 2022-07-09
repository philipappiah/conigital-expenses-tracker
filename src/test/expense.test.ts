
import Database from '../config/db'
import { ExpenseModel } from '../models/expenses.model'
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || 4000
const SERVER_URL = `${BASE_URL}:${PORT}`

const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/mydb`


new Database(MONGO_URL).connectDataBase()

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();


chai.use(chaiHttp);

describe('Expenses', () => {
  new Database(MONGO_URL).connectDataBase()

  beforeEach((done) => {
    ExpenseModel.deleteMany({}, (err) => {
      done();
    });
  });

  // /GET route
  describe('/GET expenses', () => {
    it('it should GET all the expenses', (done) => {
      chai.request(SERVER_URL)
        .get('/expenses')
        .end((err: any, res: any) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body.length.should.be.eql(0);
          done();
        });
    });
  });



  // /POST route
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
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });

  });


  // /POST route
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
          res.body.should.have.property('message').eql('Expense successfully created');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('category');
          res.body.data.should.have.property('title');
          res.body.data.should.have.property('cost');
          res.body.data.should.have.property('time');

          done();
        });
    });



  });





  // /GET/:id route
  describe('/GET/:id expense', () => {
    it('it should GET an expense by the given id', (done) => {

      let expense = new ExpenseModel({
        category: "Transport",
        title: "bus ticket",
        cost: 40
      });
      expense.save((err, book) => {
        chai.request(SERVER_URL)
          .get('/expenses/' + expense.id)
          .send(expense)
          .end((err: any, res: any) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.have.property('id');
            res.body.data.should.have.property('category');
            res.body.data.should.have.property('title');
            res.body.data.should.have.property('cost');
            res.body.data.should.have.property('time');
            res.body.data.should.have.property('id').eql(expense.id);
            done();
          });
      });

    });
  })


  // test reports endpoint
 
  describe('GET /reports path', () => {
   
    it('it should GET first report for the month of July' ,(done) => {
        const reportName = "report1-7"
        chai.request(SERVER_URL)
            .get(`/expenses/reports/${reportName}`)
            .end((err:any, res:any) => { 
                res.should.have.status(200); 
                res.headers['content-type'].should.have.string('text/csv');
                done();
            });
    });
});

});


