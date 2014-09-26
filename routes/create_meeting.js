
var async = require("async")
var errbldr = require("../errors/builder")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")

module.exports = function(req, res) {
  logger.info("POST /meeting")

  // Extract data from the post data
  var me = req.body.userId
  var lat = req.body.lat
  var lng = req.body.lng
  var datetime = req.body.datetime

  if (!me || !gcm || !lat || !lng || !datetime) {
    logger.warn("Client supplied an illformatted POST body. Sending 400.")
    res.status(400).send(errbldr.build400("POST body was not formatted correctly."))
    return
  }

  // Generate a random meeting id
  var mid = Math.random().toString(36).substring(5)

  // Create the user in mogno
  var user = {'userId': me, 'lat': lat, 'lng': lng}
  mongoUsers.createUser(user, onMongoUserCreated(res, mid, datetime, me))

}

var onMongoUserCreated = function(response, meetingId, datetime, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Mongo threw an error while creating a user during meeting creation. Sending 500 to client.")
      response.status(500).send(errbldr.build500())
      return
    }

    // Create the meeting afterward
    var meeting = {"meetingId": meetingId, "datetime": datetime, "members": [userId]}
    mongoMeetings.createMeeting(meeting, onMongoMeetingCreated(response, meetingId))

  }

}

var onMongoMeetingCreated = function(response, meetingId) {

  return function(err, result) {

    if (err) {
      logger.error("Mongo threw an error while creating a meeting. Sending 500 to client.")
      response.status(500).send(errbldr.build500())
      return
    }

    var returnObj = {"meetingId": meetingId}
    response.status(201).send(returnObj)

  }

}
