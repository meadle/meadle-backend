
// Imports
var logger = require('log4js').getLogger()
var q = require('q')

// Setting up firebase
logger.trace('Setting up firebase users client')
var fbr = require('firebase')
var fbo = new fbr('https://meadle.firebaseio.com')
var fb  = fbo.child('meetings')

/** Creates a new user in firebase */
exports.createUser = function(meetingId, userId, lat, lng, gcm) {

  var defer = q.defer()

  // Verify the content of the fields we're adding
  var msg = "Attempting to create user in firebase with improper data. Rejecting."
  if (!meetingId || !userId || !lat || !lng || !gcm) {
    logger.warn(msg)
    defer.reject(new Error(msg))
    return defer.promise
  }

  // Build the object we are storing in firebase
  var nuser = {}
  nuser.lat = lat
  nuser.lng = lng
  nuser.gcm = gcm
  nuser.voted = false

  // Set the user information in firebase
  fb.child(meetingId).child('members').child(userId).set(nuser, function(err) {
    if (err) {
      logger.error("Error creating user in firebase")
      logger.error(err)
      defer.reject(err)
    } else {
      defer.resolve()
    }
  })

  return defer.promise

}
