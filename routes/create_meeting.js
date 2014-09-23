
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")

module.exports = function(req, res) {

  // Extract data from the post data
  var me = req.body.userId;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var datetime = req.body.datetime;

  if (!validatePostData(res, me, lat, lng, datetime)) {
    return;
  }

  // Generate a random meeting id
  var mid = Math.random().toString(36).substring(5);

  // Create the user in mongo
  mongoUsers.createUser({"userId": me, "lat": lat, "lng": lng});

  // Create the meeting
  var meeting = {"meetingId": mid, "datetime": datetime, "members": [me]}
  mongoMeetings.createMeeting(meeting, onMongoMeetingCreated);

  // Pass back a 201 that the meeting was succesfully created
  var returnObj = {"meetingId": mid}
  res.status(201).send(returnObj);

}

var validatePostData = function(res, me, lat, lng, datetime) {
  if (!me || !lat || !lng || !datetime) {
    logger.warn("Client supplied an illformatted POST body. Sending 400.");
    res.status(400).send({"error":400, "message": "POST body was not formatted correctly."});
    return false;
  }
  return true;
}

var onMongoMeetingCreated = function(err, result) {

  // Right now nothing is done here
  // An error will already be logged in the mongo call if err != nil so this just does nothing for now

}
