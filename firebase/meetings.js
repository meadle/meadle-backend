
var fbr = require('firebase')
var fbo = new fbr('https://meadle.firebaseio.com')
var fb  = fbo.child('meetings')
var logger = require('log4js').getLogger()

/** Creates a new meeting on firebase */
exports.createMeeting = function(meeting, callback) {

  // Filter out only the fields we want to store in firebase
  var nmeeting = {}
  nmeeting.datetime = meeting.datetime
  nmeeting.members = meeting.members
  nmeeting.nVoted = meeting.nVoted

  // Make sure all the fields are set with non-null values
  if (!nmeeting.datetime || !nmeeting.members || !nmeeting.nVoted) {
    logger.error("Attempting to create incomplete meeting in firebase. Rejecting push.")
    return
  }

  // Set the meeting information into firebase
  fb.child(meeting.meetingId).set(nmeeting, function(err) {
    if (err) {
      logger.error("Error setting object in firebase")
      logger.error(err)
    }
  })

}
