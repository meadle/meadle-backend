
var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("meetings");

exports.getMeeting = function(meetingId, callback) {

  collection.findOne({"meetingId": meetingId}, function(err, result) {

    if (err) {
      console.log("Error while reading meeting " + meetingId + " from database");
    } else {
      console.log("Database get complete");
      callback(err, result);
    }

  });

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

    if (err) {
      console.log("Error while creating meeting.");
    } else {
      console.log("Meeting " + meeting.meetingId + " inserted into database");
    }

  });

}

/*
 * This should have the same format as above, but should retain the
 * _id field that mongo adds so we can update it in the database.
 */
exports.addMember = function(member, meetingId) {

  collection.update({"meetingId": meetingId},
    {
      "$push": {
        "members": member
      }
    }, function(err, result) {

      if (err) {
          console.log("Error adding " + member + " to meeting " + meetingId);
      } else {
          console.log("Member " + member + " added to group")
      }

    }
  );

}
