
var gcm = require("../util/gcm")
var logger = require("log4js").getLogger()
var mongoMeetings = require("../util/mongo_meetings")
var mongoUsers = require("../util/mongo_users")
var responder = require("../util/response")

module.exports = function(req, res) {

  // Extract data from put
  var meetingId = req.param("meetingId")
  var userId = req.param("userId")
  var votes = req.body.ranked
  logger.info(votes)

  if (!meetingId || !userId || !votes) {
    logger.warn("Client supplied an illformatted PUT body. Sending 400.")
    responder.sendBadRequest(res, "PUT body was not formatted correctly.")
    return
  }

  // Get the meeting object the user requested
  mongoMeetings.getMeeting(meetingId, onGetMeeting(res, meetingId, userId, votes))

}

var onGetMeeting = function(res, meetingId, userId, votes) {

  return function(err, result) {

    if (err) {
      logger.warn("Error getting meeting to update during user vote. Sending 500.")
      responder.sendInternal(res)
      return
    }

    // Verify that the user is a member of the meeting
    var members = result.members
    if (members.indexOf(userId) === -1) {
      logger.warn("The client is not authorized to vote on meeting " + meetingId + ", sending 401.")
      responder.sendUnauthorized(res)
      return
    }

    // Get the top locations already voted on
    var topLocations = result.topLocations

    // Now run through it again for real
    var position = 0
    votes.forEach(function(yelpid) {
      var index = votes.indexOf(yelpid)
      var newVote = topLocations[yelpid] + (votes.length - index)
      topLocations[yelpid] = newVote
    })
    logger.info(topLocations)

    // Re-set this object in mongo
    // I feel like this entire function is a huge race condition...
    mongoMeetings.setTopLocations(result.meetingId, topLocations, onSetTopLocations(res, result, userId, topLocations))

  }

}

var onSetTopLocations = function(res, meeting, userId, topLocations) {

  return function(err, result) {

    if (err) {
      loggeer.error("Error setting top locations for meetings in mongo")
      responder.sendInternal(res)
      return
    }

    // At this point we're going to assume there are only two users, this will be improved later
    // Calculate the current winner
    var max = -1
    var top = ""
    Object.keys(topLocations).forEach(function(yelpId) {
      if (topLocations[yelpId] > max) {
        max = topLocations[yelpId]
        top = yelpId
      }
    })

    // Set the top location
    mongoMeetings.setFinalLocation(meeting.meetingId, top, onFinalLocationSet(res, meeting, userId, topLocations, top))

  }

}

var onFinalLocationSet = function(res, meeting, userId, meetingVotes, top) {

  return function(err, result) {

    if (err) {
      logger.error("Error setting final location in mongo")
      responder.sendInternal(res)
      return
    }

    // Send gcm to members
    gcm.sendVotingFinished(meeting.members, top)

    var obj = {'status': 202, 'message':'Accepted'}
    responder.sendAccepted(res, obj)

  }

}