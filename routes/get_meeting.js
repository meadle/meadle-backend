
var logger = require("log4js").getLogger()
var meetingModel = require("../models/meeting")
var mongoMeetings = require("../util/mongo_meetings")

module.exports = function(req, res) {

  // Extract the meeting id from the request parameters
  var meetingId = req.param("meetingId")

  // Extract the user Id
  var userId = req.param("userId")

  // Log it out here so we have the meeting and user Ids
  logger.info("GET /meeting/" + meetingId + "by user " + userId);

  // Query mongo for the meeting
  mongoMeetings.getMeeting(meetingId, function(err, result) {

    if (err) {
      logger.error("Mongo returned an error on query. Sending 500 to client.");
      res.status(500).send("An error occured in mongo."); return;
    }

    if (!result) {
      logger.warn("Queried meeting id " + meetingId + " does not exist in mongo. Returning 404 to client.");
      res.status(404).send({"error":404, "message": "The requested meadle could not be found."}); return;
    }

    // Check to ensure the requesting user has permission to request the meeting
    var members = result.members;
    if (members.indexOf(userId) === -1) {
      logger.warn("The client is not authorized to view meeting " + meetingId + ", sending 401.");
      res.status(401).send("Unauthorized"); return;
    }

    // Filter the meeting of any sensitive information
    var meeting = meetingModel.filter(result);

    // Send the result to the client
    res.status(200).send(meeting);

  });

}
