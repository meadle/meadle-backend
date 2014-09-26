
var resbldr = require('../util/res_sender')
var gcm = require('../util/gcm')('AIzaSyAHjol3Ke9-HGOl9O4wEWl8r9lwvnjqkVo');
var geo = require("../util/geo")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../mongodb/mongo_meetings")
var mongoUsers = require("../mongodb/mongo_users")
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
  logger.info("PUT /meeting/{id}/join")

  // Extract from post data
  var meetingId = req.param("meetingId")
  var me = req.body.userId
  var lat = req.body.lat
  var lng = req.body.lng

  if (!meetingId || !me || !lat || !lng) {
    logger.warn("Client supplied an illformatted PUT body. Sending 400.")
    resbldr.sendBadRequest(res, "PUT body was not formatted correctly")
    return
  }

  // Create the user in mongo
  var user = {"userId": me, "lat": lat, "lng": lng}
  mongoUsers.createUser(user, onUserCreated(res, meetingId, me))

}

var onUserCreated = function(response, meetingId, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Creating a user during join meeting failed in mongo. Sending 500")
      resbldr.sendInternalError(response)
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
      resbldr.sendInternalError(response)
      return
    }

    if (!result) {
      logger.warn("Requested meeting id does not exist in storage")
      resbldr.sendNotFound(response, "No meeting by that id was found")
      return
    }

    if (result.members.length >= 2) {
      logger.warn("User " + userId + " tried to join a meeting that already has 2 members.")
      resbldr.sendForbidden(response, "Meetings can only have two participants")
      return
    }

    // Add the member to the meeting
    mongoMeetings.addMember(meetingId, userId, onMemberAdded(response, result, userId))

  }

}

var onMemberAdded = function(response, meeting, userId) {

  return function(err, result) {

    if (err) {
      logger.error("Error adding member to meeting in mongo. Sending 500.")
      resbldr.sendInternalError(response)
      return
    }

    // Calculate and store the midpoint in mongo
    geo.calcAndStoreMidpoint(meeting.meetingId, onMidpointStored(response, meeting, userId))

  }

}

var onMidpointStored = function(response, meeting, userId) {

  return function(err, result) {

    if (err) {
      logger.error("An error was thrown during midpoint calculation")
      resbldr.sendInternalError(response)
      return
    }

    // Query yelp for businesses
    yelp.getBusinesses(result, onGetYelpBusinesses(response, meeting, userId))

  }

}

var onGetYelpBusinesses = function(response, meeting, userId) {

  return function(err, results) {

    if (err) {
      if (err.statusCode == 400) {
        logger.warn("Yelp couldn't find any businesses in their area. Setting empty array in mongo meeting structure.")
        results = []
      } else {
        logger.error("An error was thrown during the yelp API call")
        resbldr.sendInternalError(response)
        return
      }
    }

    // Results should be a list of business IDs. Store them in mongo.
    mongoMeetings.setTopLocations(meeting.meetingId, results, onTopLocationsSet(response, meeting, userId))

  }

}

var onTopLocationsSet = function(response, meeting, userId) {

  return function(err, result) {

    if (err) {
      logger.error("An error was thrown during setting top locations in mongo for meeting " + meetingId)
      resbldr.sendInternalError(response)
      return
    }

    // Send a notiication to all the users in the meeting
    var members = meeting.members
    var obj = { 'message': 'User has joined' }
    gcm.sendNotification(members, obj, false).then(function(res) {
      logger.info('GCM Response: ' + JSON.stringify(res))
    })

    var returnobj = {'status': 202, 'message': 'Accepted'}
    resbldr.sendAccepted(response, returnobj)
    return

  }

}
