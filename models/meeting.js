
var logger = require("log4js").getLogger();

/** Takes in a meeting object from mongo and filters out all the "private" fields
 *  so it is safe to return to the client in a GET /meeting */
exports.filter = function(meeting) {
  logger.trace("models/meeting.filter() : Purging sensitive data from meeting " + meeting.meetingId);

  var newMeeting = {}
  newMeeting.meetingId = meeting.meetingId;
  newMeeting.datetime = meeting.datetime;
  newMeeting.location = meeting.finalLocation;

  // For the top loctions field, filter out the votes
  if (meeting.topLocations) {
    var tl = []
    Object.keys(meeting.topLocations).forEach(function(meeting) {
      tl.push(meeting)
    })
    newMeeting.topLocations = tl
  }

  // Ignored fields:
  // meeting.lat
  // meeting.lng
  // meeting.members

  return newMeeting;

}
