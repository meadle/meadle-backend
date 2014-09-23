
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")

module.exports = function(req, res) {

  // Extract data from put
  var meetingId = req.param("meetingId")
  var userId = req.param("userId")
  var votes = req.body.ranked

  if (!validatePutBody(res, meetingId, userId, votes)) {
    return
  }

  // Get the meeting object the user requested
  mongoMeetings.getMeeting(meetingId, onGetMeeting(res, meetingId, userId))

}

var validatePutBody = function(res, meetingId, userId, votes) {
  if (!meetingId || !userId || !votes) {
    logger.warn("Client supplied an illformatted PUT body. Sending 400.")
    res.status(400).send({"error":400, "message": "PUT body was not formatted correctly."})
    return false
  }
  return true;
}

var onGetMeeting = function(res, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.warn("Error getting meeting to update during user join. Sending 500.")
      response.status(500).send({"error": 500, "message": "Internal server error"})
      return
    }

    // Verify that the user is a member of the meeting
    var members = result.members
    if (members.indexOf(userId) === -1) {
      logger.warn("The client is not authorized to vote on meeting " + meetingId + ", sending 401.")
      res.status(401).send("Unauthorized")
      return
    }



  }

}
