
var async = require("async")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")

module.exports = function(req, res) {

  // Extract data from the post data
  var me = req.body.userId
  var gcm = req.body.gcm
  var lat = req.body.lat
  var lng = req.body.lng
  var datetime = req.body.datetime

  if (!validatePostData(res, me, lat, lng, datetime)) {
    return
  }

  // Generate a random meeting id
  var mid = Math.random().toString(36).substring(5)

  // Create the user in mogno
  var user = {"userId": me, "gcm", gcm, "lat": lat, "lng": lng}
  mongoUsers.createUser(user, onMongoUserCreated(res, mid, datetime, me))

}

var validatePostData = function(res, me, lat, lng, datetime) {
  if (!me || !lat || !lng || !datetime) {
    logger.warn("Client supplied an illformatted POST body. Sending 400.")
    res.status(400).send({"error":400, "message": "POST body was not formatted correctly."})
    return false
  }
  return true
}

var onMongoUserCreated = function(response, meetingId, datetime, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Mongo threw an error while creating a user during meeting creation. Sending 500 to client.")
      response.status(500).send({"error": 500, "message": "Internal server error"})
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
      response.status(500).send({"error":500, "message": "Internal server error."})
      return
    }

    var returnObj = {"meetingId": meetingId}
    response.status(201).send(returnObj)

  }

}
