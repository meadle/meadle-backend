
var gcm = require("../util/gcm")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")

module.exports = function(req, res) {

  // Extract data from put
  var meetingId = req.param("meetingId")
  var userId = req.param("userId")
  var votes = req.body.ranked

  if (!meetingId || !userId || !votes) {
    logger.warn("Client supplied an illformatted PUT body. Sending 400.")
    res.status(400).send({"error":400, "message": "PUT body was not formatted correctly."})
    return
  }

  // Get the meeting object the user requested
  mongoMeetings.getMeeting(meetingId, onGetMeeting(res, meetingId, userId, votes))

}

var onGetMeeting = function(res, meetingId, userId, votes) {

  return function(err, result) {

    if (err) {
      logger.warn("Error getting meeting to update during user vote. Sending 500.")
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

    // Get the top locations already voted on
    var topLocations = result.topLocations

    // Run through the entire list the user gave once to ensure it is accurate with what we're storing in mongo
    keys(topLocations).forEach(function(yelpId) {
      var index = votes.indexOf(yelpId)

      if (index === -1) {
        logger.warn("Client provided an incorrect list of yelp Ids")
        logger.warn(yelpId + " exists in mongo but was not provided by the user")
        res.status(400).send({'error': 400, 'message': 'Yelp Id list provided is incorrect'})
        return
      }
    })

    // Now run through it again for real
    var position = 0
    keys(topLocations).forEach(function(yelpId) {
      var index = votes.indexOf(yelpId)
      topLocations[yelpId] += (votes.length - (position++))
    })

    // Re-set this object in mongo
    // I feel like this entire function is a huge race condition...
    mongoMeetings.setTopLocations(meetingId, topLocations, function(err, result) {

      if (err) {
        loggeer.error("Error setting top locations for meetings in mongo")
        res.status(500).send("internal thingy")
        return
      }

      // At this point we're going to assume there are only two users, this will be improved later
      // Calculate the current winner
      var max = -1
      var top = ""
      keys(topLocations).forEach(function(yelpId) {
        if (topLocations[yelpId] > max) {
          max = topLocations[yelpId]
          top = yelpId
        }
      })

      // Get list of all users
      mongoMeetings.getGcmIds(meetingId, function(err, results) {
        gcm.sendNotification(results, {'topLocation':top}, false).then(function(response) {
          res.status(202).send()
        })
      })

    })

  }

}
