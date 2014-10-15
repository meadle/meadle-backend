
var fbm = require('../firebase/meetings')
var logger = require("log4js").getLogger()
var meetingModel = require("../models/meeting")
var responder = require('../util/response')

module.exports = function(req, res) {
  logger.info("GET /meeting/{id}")

  // Extract the meeting id from the request parameters
  var meetingId = req.param("meetingId")

  // Extract the user Id
  var gcm = req.param("userId")

  // Validate it
  if (!meetingId || !gcm) {
    var message = "Client provided illformatted parameters."
    logger.warn(message)
    responder.sendBadRequest(res, message)
    return
  }

  // Query database for meeting
  var qm = fbm.getMeeting(meetingId)
  qm.then(onResolve(res, gcm), onReject(res))

}

var onResolve = function(res, gcm) {
  return function(result) {

    // Confirm the user has permission to access this meeting
    var contains = false
    console.log(result.members instanceof Array)
    Object.keys(result.members).forEach(function(userId) {
      if (userId === gcm) {
        contains = true
      }
      if (result.members[userId].gcm === gcm) {
        contains = true
      }
    })

    if (!contains) {
      logger.warn("User " + gcm + " is unauthorized to obtain this meeting")
      responder.sendUnauthorized(res)
      return
    }

    // Purge the object of any protected fields
    var nresult = {}
    nresult.datetime = result.datetime
    nresult.nMembers = result.nMembers
    nresult.nVoted = result.nVoted

    responder.sendOk(res, nresult)
  }
}

var onReject = function(res) {
  return function(err) {
    responder.sendInternal(res)
  }
}
