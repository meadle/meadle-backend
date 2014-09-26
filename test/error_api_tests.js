
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

  it('get /meeting/{id} with nonexistent meetingId', function(done) {

    superagent.get(BASE_URL + 'meeting/' + '203984572930475?userId=390434')
      .end(function(err, res) {

        should(res.status).eql(404)
        done()

      })

  })

  it('get /meeting/{id} with unauthorized user', function(done) {

    superagent.post(BASE_URL + 'meeting/')
      .send( { 'userId': '123', 'lat': 2.2, 'lng': 4.2, 'datetime': "12-23-2014" } )
      .end(function(err, res) {

        var meetingId = res.body.meetingId
        superagent.get(BASE_URL + 'meeting/' + meetingId + '?userId=333')
          .end(function(mErr, mRes) {

            should(mRes.status).eql(401)
            done()

          })

      })

  })

  it('put /meeting/{id}/join with incorrectly named properties', function(done) {

    var uid1 = "646464"
    var uid2 = "987765"
    var meetingId = "-1"

    superagent.post(BASE_URL + 'meeting/')
      .send( { 'userId': uid1, 'lat': 2.2, 'lng': 4.1, 'datetime': "10230248" } )
      .end(function(err, res) {

        should(res.status).eql(201)
        meetingId = res.body.meetingId

        superagent.put(BASE_URL + 'meeting/' + meetingId + '/join')
          .send( { 'userId': uid2, 'latitude': 55.2, 'longitude': 98.21, "datetime": "92304834" } )
          .end(function(mErr, mRes) {

            should(mRes.status).eql(400)
            done()

          })

      })

  })

  it('put /meeting/{id}/join with missing properties', function(done) {

    var uid1 = "64646444"
    var uid2 = "98776522"
    var meetingId = "-1"

    superagent.post(BASE_URL + 'meeting/')
      .send( { 'userId': uid1, 'lat': 2.2, 'lng': 4.1, 'datetime': "10230248" } )
      .end(function(err, res) {

        should(res.status).eql(201)
        meetingId = res.body.meetingId

        superagent.put(BASE_URL + 'meeting/' + meetingId + '/join')
          .send( { 'latitude': 55.2, 'longitude': 98.21, "datetime": "92304834" } )
          .end(function(mErr, mRes) {

            should(mRes.status).eql(400)
            done()

          })

      })

  })

})
