
var logger = require("log4js").getLogger();
var yelp = require('../util/yelp');
var should = require('should');
var app = require('../server');
var request = require('supertest')
var port = 3000;

/** I just kind of use this to test code as im writing it. Nothing official and its cleaner than
 *  editing server.js every time. */
 /*
exports.run = function() {
  logger.trace("Running pre-start tests");


  logger.trace("Pre-start tests completed successfully");
}

*/
describe('POST /meeting', function(){
  it('respond with json including the meadle id', postMeetingTest)
});


function postMeetingTest(){
  request(app)
    .post('/meeting')
    .send({userId:1234,lat:100.65,lng:60.75,datetime:2014-09-16})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect('meetingId');
    .expect(201);
}
