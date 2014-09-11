
/** Takes in a meeting object from mongo and filters out all the "private" fields
 *  so it is safe to return to the client in a GET /meeting */
exports.filter = function(meeting) {

  var newMeeting = {}
  newMeeting.id = meeting.id;
  newMeeting.datetime = meeting.datetime;
  newMeeting.topLocations = meeting.topLocations;
  newMeeting.location = meeting.location;

  // Ignored fields:
  // meeting.lat
  // meeting.lng
  // meeting.members

  return newMeeting;

}
