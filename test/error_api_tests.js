
var superagent = require('superagent');
var should = require('should');
var meetingId;

var BASE_URL = "http://localhost:3000/"

/** Error codes on the meeting endpoints */
describe('Meeting Endpoints (Error Codes)', function() {

  it('post /meeting with incorrectly named properties', function(done) {

    superagent.post(BASE_URL + 'meeting')
      .send( { "my_user_id": "1234555", 'latitude': -78.2, 'longitude': 42.3, 'date': "13245" } )
      .end(function(err, res) {

        should(res.status).eql(400)
        done()

      })

  })

  it('post /meeting with missing properties', function(done) {

    superagent.post(BASE_URL + 'meeting')
      .send( { 'lat': 23.23, 'lng': 44.1 } )
      .end(function(err, res) {

        should(res.status).eql(400)
        done()

      })

  })

})
