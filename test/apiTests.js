var superagent = require('superagent');
var should = require('should');
var meetingId;


/*
    Starts tests for API POSTS
*/
describe('API Tests POST',function(){
    it('Tests that POST /meeting is successful',function(done){
      superagent.post("http://localhost:3000/meeting")
      .send({ 'userId':'1234','lat':100.65,'lng':60.75,'datetime':'2014-09-16' })
      .end(function(e,res){
        should(res.status).eql(201);
        should(res.body).have.property('meetingId');
        should(res.body.meetingId).be.a.String;
        done();
      });
    });
});

/*
    Ends tests for API POSTS
*/

/*
    Starts test for API GET
*/

describe('API TESTS GET',function(){
    before(function(done){
        superagent.post("http://localhost:3000/meeting")
        .send({ 'userId':'1234','lat':100.65,'lng':60.75,'datetime':'2014-09-16' })
        .end(function(e,res){
          meetingId = res.body.meetingId;
          done();

        });
    });
    it('Gets a meeting',function(done){
        superagent.get("http://localhost:3000/meeting/"+meetingId+"?userId=1234")
        .end(function(e,res){
          should(res.status).eql(200);
          should(res.body).have.property("meetingId");
          should(res.body).have.property("datetime");
          should(res.body.meetingId).be.a.String;
          should(res.body.datetime).be.a.String;
          done();
        });
    });
});
/*
    End tests for for API GET
*/

/*
    Test for root to respond correctly
*/


describe('GET /',function(done){
  it('Tests to see if / is able to be accessed ',function(done){
    superagent.get("http://localhost:3000")
      .end(function(e,res){
        should(res.status).eql(200);
        should(res.text).eql('A-OK');
        done();
      });

  });
});


/*
    Starts Tests for API PUT
*/
describe('API TESTS PUT',function(){
    before(function(done){
        superagent.post("http://localhost:3000/meeting")
        .send({ 'userId':'1234','lat':100.65,'lng':60.75,'datetime':'2014-09-16' })
        .end(function(e,res){
          meetingId = res.body.meetingId;
          done();

        });
    });
    it('Joins a meeting',function(done){
        superagent.put("http://localhost:3000/meeting/"+meetingId+"/join")
        .send({ 'userId':'joined_user','lat':234.65,'lng':140.75 })
        .end(function(e,res){
          should(res.status).eql(202);
          done();
        });
    });
});
/*
    End Tests for API PUT
*/
