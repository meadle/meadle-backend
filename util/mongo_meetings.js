
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

  collection.insert(meeting);

}
