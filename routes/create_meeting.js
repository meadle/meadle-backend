
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")

module.exports = function(req, res) {

  // Extract data from the post data
  var me = req.body.userId;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var datetime = req.body.datetime;

  if (!me || !lat || !lng || !datetime) {
    logger.warn("Client supplied an illformatted POST body. Sending 400.");
    res.status(400).send({"error":400, "message": "POST body was not formatted correctly."}); return;
  }

  // Generate a random meeting id
  var mid = Math.random().toString(36).substring(5);

  // Create the user in mongo
  mongoUsers.createUser({"userId": me, "lat": lat, "lng": lng});

  // Create the meeting
  mongoMeetings.createMeeting({"meetingId": mid, "datetime": datetime, "members": [me]}, function(err, result) {

    if (err) {
      logger.error("Error while inserting meeting into mongo. Returning 500.")
      res.status(500).send({"error":500, "message":"Internal server error"}); return;
    }

    // Pass back the meeting id to the client
    res.status(201).send({"meetingId": mid});

  });

}
