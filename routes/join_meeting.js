
var geo = require("../util/geo")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")
var yelp = require("../util/yelp")

module.exports = function(req, res) {

  // Extract from post data
  var meetingId = req.param("meetingId")
  var me = req.body.userId
  var lat = req.body.lat
  var lng = req.body.lng

  if (!validatePutData(res, me, lat, lng, meetingId)) {
    return
  }

  // Create the user in mongo
  mongoUsers.createUser({"userId": me, "lat": lat, "lng": lng}, function(err, result) {

  })

  // Get the meeting in question
  mongoMeetings.getMeeting(meetingId, function(err, result) {

      if (err) {
        logger.error("Mongo threw an error during getMeeting on PUT new meeting member")
        logger.error(err)
        res.status(500).send({"error": 500, "message": "An internal error occured (1)."})
        return
      }

      if (result.members.length >= 2) {
        logger.warn("User " + me + " tried to join a meeting that already has 2 members.")
        res.status(403).send({"error": 403, "message": "Meetings can only have two participants."})
        return
      }

      // Add the member to the meeting
      mongoMeetings.addMember(meetingId, me, function(err, result) {

        // Calculate and store the midpoint in mongo
        geo.calcAndStoreMidpoint(meetingId, function(err, result) {

          if (err) {
            logger.error("An error was thrown during midpoint calculation")
            logger.error(err)
            res.status(500).send({"error": 500, "message": "An internal error occured (2)"})
            return
          }

          // Query yelp for the businesses
          yelp.getBusinesses(result, function(err, results) {

            if (err) {
              logger.error("An error was thrown during the yelp API call")
              logger.error(err)
              res.status(500).send({"error":500, "message": "An internal error occured (3)"})
              return
            }

            // Results should be a list of business IDs. Store them in mongo.
            mongoMeetings.setTopLocations(meetingId, results, function(err, result) {

            });

          });

        });

      });

  });

  res.status(202).send("Accepted")

}

var validatePutData = function(res, me, lat, lng, meetingId) {
  if (!me || !lat || !lng || !meetingId) {
    logger.warn("Client supplied an illformatted PUT body. Sending 400.")
    res.status(400).send({"error":400, "message": "PUT body was not formatted correctly."})
    return false
  }
  return true
}
