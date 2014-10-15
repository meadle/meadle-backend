
// Other imports
var logger = require('log4js').getLogger()
var q = require('q')

// Setting up firebase
logger.trace('Setting up firebase meetings client')
var fbr = require('firebase')
var fbo = new fbr('https://meadle.firebaseio.com')
var fb  = fbo.child('meetings')

/** Creates a new meeting on firebase
 *  @param meeting    The meeting object we are storing in firebase
 *                    This object is verified for correct content before being stored
 *
 * @returns qpromise  A promise which will contain an error if one is thrown during execution */
exports.createMeeting = function(meetingId, datetime, userId) {
  logger.info("Creating meeting " + meetingId + "in firebase")

  var defer = q.defer()

  // Verify the nonnullity and type of the data we're adding
  var message = "Attempting to create meeting in firebase with improperly formatted data. Rejecting."
  if (!meetingId || !datetime || !userId) {
    logger.warn(message)
    defer.reject(new Error(message))
    return defer.promise
  }

  // Create the object we're storing in firebase
  var nmeeting = {}
  nmeeting.datetime = datetime
  nmeeting.nVoted = 0
  nmeeting.nMembers = 1

  // Set the meeting information into firebase
  fb.child(meetingId).set(nmeeting, function(err) {
    if (err) {
      logger.error("Error setting object in firebase")
      logger.error(err)
      defer.reject(err)
    } else {
      defer.resolve()
    }
  })

  return defer.promise

}

/** Retrieves a meeting object and all of its content from firebase */
exports.getMeeting = function(meetingId) {
  logger.info("Retrieving meeting " + meetingId + " from firebase")

  var defer = q.defer()

  // Verify that the meetingId contains what we expect
  if (!meetingId) {
    var message = "MeetingId supplied has incorrect format"
    logger.warn(message)
    defer.reject(new Error(message))
    return defer.promise
  }

  fb.child(meetingId).once('value', function(snapshot) {
    defer.resolve(snapshot.val())
  }, function(error) {
    logger.error("Firebase threw a warning")
    logger.error(error)
    defer.reject(error)
  })

  return defer.promise

}
