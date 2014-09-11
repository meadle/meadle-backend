
var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("meetings");

exports.getMeeting = function(meetingId, callback) {

  collection.findOne({"meetingId": meetingId}, callback);

}

/*
 * The initial content of the meeting, which should contain
 *  id: ""
 *  datetime: ""
 *  members: [ // the intial member // ]
 */
exports.createMeeting = function(meeting) {

  // TODO: Add validation

  collection.insert(meeting, function(err, result) {
    console.log("Meeting " + meeting.meetingId + " inserted into mongo.");
  });

}

/*
 * This should have the same format as above, but should retain the
 * _id field that mongo adds so we can update it in the database.
 */
exports.setMeetingMembers = function(meetingId, members) {

  collection.update({"meetingId": meetingId}, {"$set": {"members": members}}, function(err, result) {

  });

}
