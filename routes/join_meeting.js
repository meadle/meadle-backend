
var geo = require("../util/geo")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")
var yelp = require("../util/yelp")

/* READ THIS FIRST
 * SERIOUSLY
 *
 *  This route is a clusterfuck of callbacks that I don't feel like unraveling, so I kind of just
 *  flattened them out and thus we have this. The overall order of callbacks is the same as listed here,
 *  and generally follows....
 *
 *  1: Validate put data                    <synchronous>
 *  2: Create user in mongo                 --> onUserCreated
 *  3: Get meeting to update from mongo     --> onGetMeeting
 *  4: Add member to meeting in mongo       --> onMemberAdded
 *  5: Calculate/store midpoint             --> onMidpointStored
 *  6: Get list of yelp businesses for midp --> onGetYelpBusinesses
 *  7: Set top locations in mongo           --> onTopLocationsSet
 */

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
  var user = {"userId": me, "lat": lat, "lng": lng}
  mongoUsers.createUser(user, onUserCreated(res, meetingId, me))

}

var validatePutData = function(res, me, lat, lng, meetingId) {
  if (!me || !lat || !lng || !meetingId) {
    logger.warn("Client supplied an illformatted PUT body. Sending 400.")
    res.status(400).send({"error":400, "message": "PUT body was not formatted correctly."})
    return false
  }
  return true
}

var onUserCreated = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.warn("Creating a user during join meeting failed in mongo. Sending 500")
      response.status(500).send({"error":500, "message": "Internal server error"})
      return
    }

    // Get the meeting the user is joining
    mongoMeetings.getMeeting(meetingId, onGetMeeting(response, meetingId, userId))

  }

}

var onGetMeeting = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.warn("Error getting meeting to update during user join. Sending 500.")
      response.status(500).send({"error": 500, "message": "Internal server error"})
      return
    }

    if (!result) {
      logger.warn("Requested meeting id does not exist in storage")
      response.status(404).send({"error":404, "message": "No meeting by that id was found"})
      return
    }

    if (result.members.length >= 2) {
      logger.warn("User " + me + " tried to join a meeting that already has 2 members.")
      res.status(403).send({"error": 403, "message": "Meetings can only have two participants."})
      return
    }

    // Add the member to the meeting
    mongoMeetings.addMember(meetingId, userId, onMemberAdded(response, meetingId, userId))

  }

}

var onMemberAdded = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.warn("Error adding member to meeting in mongo. Sending 500.")
      response.status(500).send({"error":500, "message": "Internal server error"})
      return
    }

    // Calculate and store the midpoint in mongo
    geo.calcAndStoreMidpoint(meetingId, onMidpointStored(response, meetingId, userId))

  }

}

var onMidpointStored = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.error("An error was thrown during midpoint calculation")
      res.status(500).send({"error": 500, "message": "An internal error occured (2)"})
      return
    }

    // Query yelp for businesses
    yelp.getBusinesses(result, onGetYelpBusinesses(response, meetingId, userId))

  }

}

var onGetYelpBusinesses = function(response, meetingId, userId) {

  return function(err, results) {

    if (err) {
      if (err.statusCode == 400) {
        logger.warn("Yelp couldn't find any businesses in their area. Setting empty array in mongo meeting structure.")
        results = []
      } else {
        logger.error("An error was thrown during the yelp API call")
        response.status(500).send({"error":500, "message": "An internal error occured (3)"})
        return
      }
    }

    // Results should be a list of business IDs. Store them in mongo.
    mongoMeetings.setTopLocations(meetingId, results, onTopLocationsSet(response, meetingId, userId))

  }

}

var onTopLocationsSet = function(response, meetingId, userId) {

  return function(err, result) {

      response.status(202).send({"status": 202, "message": "Accepted"})

  }

}
