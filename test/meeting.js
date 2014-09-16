
var app = require('../server');
var request = require('supertest')

describe('POST /meeting', function() {
	it('should respond with a meeting ID', postMeetingTest)
});

function postMeetingTest() {
	request(app)
    .post('/meeting')
    .send({ 'userId':'1234','lat':100.65,'lng':60.75,'datetime':'2014-09-16' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(containsMeetingIdField)
    .expect(201)
		.end(function(err, result) {
			if (err) { throw err; }
		});
}

function containsMeetingIdField(res) {
	if (!('meetingId' in res.body)) return "missing the meetingId key";
}
