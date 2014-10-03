
var logger = require("log4js").getLogger()
var meetingModel = require("../models/meeting")
var mongoMeetings = require("../util/mongo_meetings")
var responder = require('../util/response')

module.exports = function(req, res) {
  logger.info("GET /meeting/{id}")

  // Extract the meeting id from the request parameters
  var meetingId = req.param("meetingId")

  // Extract the user Id
  var userId = req.param("userId")

  // Validate it
  if (!meetingId || !userId) {
    logger.warn("Client provided illformatted parameters in GET, sending 400")
    responder.sendBadRequest(res, "Incorrect format. Please provide meeting id and user id as per API docs.")
    return
  }

  // Query mongo for the meeting
  mongoMeetings.getMeeting(meetingId, onGetMeeting(res, meetingId, userId))

}

var onGetMeeting = function(res, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Mongo returned an error on query. Sending 500 to client.")
      responder.sendInternal(res)
      return
    }

    if (!result) {
      logger.warn("Queried meeting id " + meetingId + " does not exist in mongo. Returning 404 to client.")
      responder.sendNotFound(res, "The requested meeting id could not be found.")
      return
    }

    var members = result.members

    if (members.indexOf(userId) === -1) {
      logger.warn("The client is not authorized to view meeting " + meetingId + ", sending 401.")
      responder.sendUnauthorized(res)
      return
    }

    // Filter the meeting of any sensitive information
    var meeting = meetingModel.filter(result)

    // Send the result to the client
    responder.sendOk(res, meeting)

  }

}
