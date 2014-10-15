
var fbm = require('../firebase/meetings')
var fbu = require('../firebase/users')
var genid = require('../util/ids')
var logger = require('log4js').getLogger()
var responder = require('../util/response')
var q = require('q')

module.exports = function(req, res) {
  logger.info("POST /meeting")

  // Extract data from the post data
  var gcm = req.body.userId
  var lat = req.body.lat
  var lng = req.body.lng
  var datetime = req.body.datetime

  if (!gcm || !lat || !lng || !datetime) {
    logger.warn("Client supplied an illformatted POST body. Sending 400.")
    responder.sendBadRequest(res, "POST body was not formatted correctly")
    return
  }

  // Generate a random meeting and user id
  var meetingId = genid(8)
  var userId = genid(8)

  // Create the meeting in the datastore
  var mq = fbm.createMeeting(meetingId, datetime, userId)

  // Create the user in the datastore
  var uq = fbu.createUser(meetingId, userId, lat, lng, gcm)

  // Ensure there were no errors from the promises
  var aq = q.all( [ mq, uq ] )
  aq.then(resolved(res, meetingId), rejected(res))

}

var resolved = function(res, meetingId) {
  return function(value) {
    responder.sendCreated(res, {'meetingId': meetingId})
  }
}

var rejected = function(res) {
  return function(err) {
    logger.error(err)
    responder.sendInternal(res)
  }
}
