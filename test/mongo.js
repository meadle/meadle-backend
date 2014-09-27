
var mongoInit = require('../util/mongo_init')
var mongoMeetings = require('../util/mongo_meetings')
var mongoUsers = require('../util/mongo_users')
var should = require('should');

describe('Initialize MongoDB', function() {

  // Turn off logging for these tests
  require('log4js').getLogger().setLevel('FATAL')

  it('initialize mongodb collections without error', function(done) {
    mongoInit.init(function(err, result) {
      if (err) throw err
      done()
    })
  })

})

describe('MongoDB Wrappers', function() {

  var meetingId = 'h3r20h093h402h'
  var u1id = '0s9djf09sjd'
  var u2id = 'asf9jdf9jsd9fjsd'

  it('store a meeting in mongo', function(done) {

    var meeting = {
      'meetingId': meetingId,
      'datetime': 'Friday?',
      'members': [ u1id ]
    }

    mongoMeetings.createMeeting(meeting, function(err, result) {

      if (err) throw err
      done()

    })

  })

  it('store a user in mongo', function(done) {

    var user = {
      'userId': u1id,
      'lat': 12.34,
      'lng': 56.78
    }

    mongoUsers.createUser(user, function(err, result) {
      if (err) throw err
      done()
    })

  })

  it('get a meeting from mongo', function(done) {

    mongoMeetings.getMeeting(meetingId, function(err, result) {
      if (err) throw err
      should(result.meetingId).be.a.String
      should(result.datetime).be.a.String
      should(result).have.property('members')
      done()
    })

  })

  it('get gcmids from mongo', function(done) {

    mongoMeetings.getGcmIds(meetingId, function(err, results) {
      if (err) throw err
      should(results).be.instanceof(Array)
      done()
    })

  })

})
