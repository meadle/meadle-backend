
var logger = require("log4js").getLogger();
var yelp = require('../util/yelp');
var should = require('should');
var app = require('../server').app;
var request = require('supertest')
var port = 3000;

describe('POST /meeting', function() {
	it('POST /meeting should respond with a meeting ID', postMeetingTest)
});


function postMeetingTest() {
	request(app)
    .post('/meeting')
    .send({ 'userId':'1234','lat':100.65,'lng':60.75,'datetime':'2014-09-16' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect('meetingId')
    .expect(201);
}
