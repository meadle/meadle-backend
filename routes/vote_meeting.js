
var analytics = require('../logging/google_analytics')
var comeback = require('comeback')
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
    comeback.badRequest(res, "PUT body was not formatted correctly")
    return
  }

  // Analytics
  analytics.hit(userId, 'PUT /meeting/vote')

  // Get the meeting object the user requested
  mongoMeetings.getMeeting(meetingId, onGetMeeting(res, meetingId, userId, votes))

}

var onGetMeeting = function(res, meetingId, userId, votes) {

  return function(err, result) {

    if (err) {
      logger.warn("Error getting meeting to update during user vote. Sending 500.")
      comeback.internal(res, "")
      return
    }

    if (!result) {
      logger.warn("Client requested a meeting that does not exist")
      comeback.notFound(res, "Meeting requested could not be found")
      return
    }

    // Verify that the user is a member of the meeting
    var members = result.members
    if (members.indexOf(userId) === -1) {
      logger.warn("The client is not authorized to vote on meeting " + meetingId + ", sending 401.")
      comeback.unauthorized(res, "")
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
      comeback.internal(res, "")
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
      comeback.internal(res, "")
      return
    }

    // Increment the number of meetings
    mongoMeetings.incrementNVoted(meeting.meetingId, onNVotedIncrement(res, meeting, top))

  }

}

var onNVotedIncrement = function(res, meeting, top) {

  return function(err, result) {

    if (err) {
      logger.error("Error incrementing nvoted in mongo")
      comeback.internal(res, "")
      return
    }

    if (result.nVoted === 2) {
      // Send gcm to members
      gcm.sendVotingFinished(meeting.members, top)
    }

    var obj = {'status': 202, 'message':'Accepted'}
    comeback.accepted(res, obj)

  }

}
