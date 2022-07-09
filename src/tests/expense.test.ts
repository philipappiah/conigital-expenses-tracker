
import Database from '../config/db'
import { ExpenseModel } from '../models/expense.model'
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || 4000
const SERVER_URL = `${BASE_URL}:${PORT}/api/v1`

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
          res.should.have.status(200);
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
          res.body.should.have.property('message').eql('Expense successfully created!');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('category');
          res.body.data.should.have.property('title');
          res.body.data.should.have.property('cost');
          res.body.data.should.have.property('time');

          done();
        });
    });



  });



  



  // /GET expenses/:id route
  describe('/GET/:id expense', () => {
    it('it should GET an expense by the given id', (done) => {

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



// /PATCH expenses/:id 
  describe('/PATCH/:id book', () => {
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
                    res.body.should.have.property('message').eql('Expense updated successfully!');
                    res.body.data.should.have.property('title').eql("PS5 Game");
                done();
              });
        });
    });
});


   // /DELETE expenses/:id route
   describe('/DELETE/:id expense', () => {
    it('it should DELETE an expense by the given id', (done) => {

      let model = new ExpenseModel({
        category: "Transport",
        title: "bus ticket",
        cost: 40
      });
      model.save((err, expense) => {
        chai.request(SERVER_URL)
          .delete('/expenses/' + expense.id)
          .end((err: any, res: any) => {
            res.should.have.status(200)
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Expense successfully deleted!');
            done();
          });
      });

    });
  })


  
  // /test POST /reports/createSchedule with validation errors
  describe('POST /reports', () => {
    it('it should not POST a schedule without the accepted time schedules', (done) => {
     
      // Accepted time schedules are  Minute, Hour, Day, Week, Month
      chai.request(SERVER_URL)
        .post('/reports/createSchedule')
        .send({schedule:"minut"})
        .end((err: any, res: any) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('fail');
         
          done();
        });
    });

  });


    // /test POST /reports/createSchedule without validation errors. Schedule report generation
   describe('POST /reports', () => {
    it('it should POST a schedule', (done) => {
     
      // Accepted time schedules are  Minute, Hour, Day, Week, Month
      chai.request(SERVER_URL)
        .post('/reports/createSchedule')
        .send({schedule:"minute"})
        .end((err: any, res: any) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
         
          done();
        });
    });

  });

// GET /reports list all reports generated
  describe('/GET /reports', () => {
    it('it should GET list of reports', (done) => {
      chai.request(SERVER_URL)
        .get('/reports')
        .end((err: any, res: any) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          
          done();
        });
    });
  });



  // test view report  by id
 // GET /reports/:id
  describe('GET /reports/:name', () => {
   
    it('it should GET first report' ,(done) => {
  
        chai.request(SERVER_URL)
        .get('/reports')
        .end((err: any, res: any) => {
          res.body.should.be.a('array');
          
          if(res.body.length){
            let reportname = res.body[0]
            chai.request(SERVER_URL)
            .get(`/reports/${reportname}`)
            .end((err:any, res:any) => { 
                res.should.have.status(200); 
                res.headers['content-type'].should.have.string('text/csv');
                done();
            });
          }else{
            done();
          }

        })
       
    });
});

});


