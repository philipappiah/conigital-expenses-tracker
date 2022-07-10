import chai = require('chai');
import chaiHttp = require('chai-http');

require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || 4000
const SERVER_URL = `${BASE_URL}:${PORT}/api/v1`


let should = chai.should();
chai.use(chaiHttp);

describe('Schedule', () => {
  


  
  // /test POST /schedule with validation errors
  describe('POST /schedule', () => {
    it('it should not POST a schedule without the accepted time schedules', (done) => {
     
      // Accepted time schedules are  Minute, Hour, Day, Week, Month
      chai.request(SERVER_URL)
        .post('/schedule')
        .send({schedule:"minut"})
        .end((err: any, res: any) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('fail');
         
          done();
        });
    });

  });


    // /test POST /schedule without validation errors. Schedule report generation
   describe('POST /schedule', () => {
    it('it should POST a report schedule', (done) => {
     
      // Accepted time schedules are  Minute, Hour, Day, Week, Month
      chai.request(SERVER_URL)
        .post('/schedule')
        .send({schedule:"MONTH"})
        .end((err: any, res: any) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
         
          done();
        });
    });

  });


  // test GET /schedule get last scheduled time for report generation
  describe('/GET /schedule', () => {
    it('it should GET last report schedule', (done) => {
      chai.request(SERVER_URL)
        .get('/schedule')
        .end((err: any, res: any) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('schedule').eql('MONTH');
          done();
        });
    });
  });




});


