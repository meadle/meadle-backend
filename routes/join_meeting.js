
var errbldr = require('../errors/builder')
var geo = require("../util/geo")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")
var yelp = require("../util/yelp")
var gcm = require('../util/gcm')

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
  logger.info("PUT /meeting/{id}/join")

  // Extract from post data
  var meetingId = req.param("meetingId")
  var me = req.body.userId
  var lat = req.body.lat
  var lng = req.body.lng

  if (!meetingId || !me || !lat || !lng) {
    logger.warn("Client supplied an illformatted PUT body. Sending 400.")
    res.status(400).send(errbldr.build400("PUT body was not formatted correctly"))
    return
  }

  // Create the user in mongo
  var user = {"userId": me, "meetingId": meetingId, "lat": lat, "lng": lng}
  mongoUsers.createUser(user, onUserCreated(res, meetingId, me))

}

var onUserCreated = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Creating a user during join meeting failed in mongo. Sending 500")
      response.status(500).send(errbldr.build500())
      return
    }

    // Get the meeting the user is joining
    mongoMeetings.getMeeting(meetingId, onGetMeeting(response, meetingId, userId))

  }

}

var onGetMeeting = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Error getting meeting to update during user join. Sending 500.")
      response.status(500).send(errbldr.build500())
      return
    }

    if (!result) {
      logger.warn("Requested meeting id does not exist in storage")
      response.status(404).send(errbldr.build404("No meeting by that id was found"))
      return
    }

    if (result.members.length >= 2) {
      logger.warn("User " + userId + " tried to join a meeting that already has 2 members.")
      response.status(403).send(errbldr.build403("Meetings can only have two participants."))
      return
    }

    // Add the member to the meeting
    mongoMeetings.addMember(meetingId, userId, onMemberAdded(response, meetingId, userId))

  }

}

var onMemberAdded = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Error adding member to meeting in mongo. Sending 500.")
      response.status(500).send(errbldr.build500())
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
      res.status(500).send(errbldr.build500())
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
        response.status(500).send(errbldr.build500())
        return
      }
    }

    // Results should be a list of business IDs. Store them in mongo.
    mongoMeetings.setTopLocations(meetingId, results, onTopLocationsSet(response, meetingId, userId))

  }

}

var onTopLocationsSet = function(response, meetingId, userId) {

  return function(err, result) {

    mongoMeetings.getMeeting(meetingId, onGetMeetingTwo(response, meetingId, userId))

  }

}

var onGetMeetingTwo = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Error thrown during get meeting 2 for user join meeting")
      response.status(500).send(errbldr.build500())
      return
    }

    var gcmIds = result.members

    response.status(202).send({"status": 202, "message": "Accepted"});

    gcm.sendUserJoined(gcmIds, userId)



  }

}
