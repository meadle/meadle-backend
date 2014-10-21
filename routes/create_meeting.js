
var comeback = require('comeback')
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

  if (!me || !lat || !lng || !datetime) {
    logger.warn("Client supplied an illformatted POST body. Sending 400.")
    comeback.badRequest(res, "POST body was not formatted correctly")
    return
  }

  // Generate a random meeting id
  var mida = []
  for (i = 0; i < 9; i++) {
    mida[i] = Math.floor(Math.random()*9)
  }
  var meetingId = mida.join("")

  // Create the user in mogno
  var user = {"userId": me, "meetingId": meetingId, "lat": lat, "lng": lng}
  mongoUsers.createUser(user, onMongoUserCreated(res, meetingId, datetime, me))

}

var onMongoUserCreated = function(response, meetingId, datetime, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Mongo threw an error while creating a user during meeting creation. Sending 500 to client.")
      comeback.internal(response, "")
      return
    }

    // Create the meeting afterward
    var meeting = {"meetingId": meetingId, "datetime": datetime, "members": [userId], "nVoted": 0}
    mongoMeetings.createMeeting(meeting, onMongoMeetingCreated(response, meetingId))

  }

}

var onMongoMeetingCreated = function(response, meetingId) {

  return function(err, result) {

    if (err) {
      logger.error("Mongo threw an error while creating a meeting. Sending 500 to client.")
      comeback.internal(response, "")
      return
    }

    var returnObj = {"meetingId": meetingId}
    comeback.created(response, returnObj)

  }

}
