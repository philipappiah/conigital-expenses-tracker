import chai = require('chai');
import chaiHttp = require('chai-http');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || 4000
const SERVER_URL = `${BASE_URL}:${PORT}/api/v1`


let should = chai.should();
chai.use(chaiHttp);

describe('Reports', () => {
  
// GET /reports list all reports generated
  describe('/GET reports', () => {
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
  describe('GET:/name /reports', () => {
   
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


