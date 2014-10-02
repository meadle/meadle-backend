
var superagent = require('superagent');
var should = require('should');
var meetingId;

var BASE_URL = "http://localhost:3000/"

var shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/** Test Root URL Endpoints */
describe('Root URL', function() {

  it('get /', function(done) {

    superagent.get(BASE_URL)
      .end(function(err, res) {

        should(res.status).eql(200)
        should(res.body).have.property("status")
        should(res.body.status).eql(200)
        should(res.body).have.property("message")
        should(res.body.message).be.a.String
        done()

      })

  })

})

/** Test Meeting Endpoints */
describe('Meeting Endpoints (Happy Path)', function() {

  var test_user_id = "12345"
  var test_user2_id = "56578"
  var test_meeting_id = "-1"

  it('post /meeting', function(done) {

    superagent.post(BASE_URL + "meeting")
      .send({'userId': test_user_id, 'lat': 51.5033630, 'lng':-0.1276250, 'datetime':'2014-09-16'})
      .end(function(err, res) {

        should(res.status).eql(201)
        should(res.body).have.property('meetingId')
        should(res.body.meetingId).be.a.String
        test_meeting_id = res.body.meetingId
        done()

      })

  })

  it('get /meeting/{id} first user', function(done) {

    superagent.get(BASE_URL + 'meeting/' + test_meeting_id + "?userId=" + test_user_id)
      .end(function(err, res) {

        should(res.status).eql(200)
        should(res.body).have.property("meetingId")
        should(res.body).have.property("datetime")
        should(res.body.meetingId).be.a.String
        should(res.body.datetime).be.a.String
        done()

      })

  })

  it('put /meeting/{id}/join', function(done) {

    superagent.put(BASE_URL + "meeting/" + test_meeting_id + "/join")
      .send({ 'userId': test_user2_id, 'lat': 51.70, 'lng': -0.22 })
      .end(function(err, res) {

        should(res.status).eql(202)
        done()

      })

  })

  var topLocations = []

  it('get /meeting/{id} second user', function(done) {

    superagent.get(BASE_URL + 'meeting/' + test_meeting_id + "?userId=" + test_user2_id)
      .end(function(err, res) {

        should(res.status).eql(200)
        should(res.body).have.property("meetingId")
        should(res.body).have.property("datetime")
        should(res.body.meetingId).be.a.String
        should(res.body.datetime).be.a.String

        // Save the list of top locations
        topLocations = res.body.topLocations
        console.log(topLocations)

        done()

      })

  })

  var test_user1_votes = shuffle(topLocations)
  var test_user2_votes = shuffle(topLocations)

  it('put /meeting/{id}/vote first user', function(done) {

    superagent.put(BASE_URL + 'meeting/' + test_meeting_id + "/vote?userId=" + test_user_id)
      .send({'ranked': test_user1_votes})
      .end(function(err, res) {

        should(res.status).eql(202)

        done()

      })
  })



})
