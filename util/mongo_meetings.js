
var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("meetings");
var logger = require("log4js").getLogger();

exports.getMeeting = function(meetingId, callback) {

  collection.findOne({"meetingId": meetingId}, function(err, result) {

    if (err) {
      logger.error("Error while reading meeting " + meetingId + " from database.")
      logger.error(err)
    }
    callback(err, result)

  })

}

/*
 * The initial content of the meeting, which should contain
 *  id: ""
 *  datetime: ""
 *  members: [ // the intial member // ]
 */
exports.createMeeting = function(meeting, callback) {

  // TODO: Add validation

  collection.insert(meeting, function(err, result) {

    if (err) {
      logger.error("Error while creating meeting in mongo.")
    }
    callback(err, result)

  })

}

/*
 * This should have the same format as above, but should retain the
 * _id field that mongo adds so we can update it in the database.
 */
exports.addMember = function(meetingId, userId, callback) {

  /** TODO Validations */

  collection.update({"meetingId": meetingId},
    {
      "$push": {
        "members": userId
      }
    }, function(err, result) {

      if (err) {
          logger.error("Error adding " + member + " to meeting " + meetingId + " in mongo.")
      }
      callback(err, result)

    }
  )

}

exports.setMidpoint = function(meetingId, latitude, longitude, callback) {

  /** TODO Validations */

  collection.update({"meetingId": meetingId},
  {
    "$set": {
      "lat": latitude,
      "lng": longitude
    }
  }, function(err, result) {

    if (err) {
      logger.error("Error setting midpoint on meeting " + meetingId + " in mongo.")
    }
    callback(err, result)

  })

}

exports.setTopLocations = function(meetingId, locations, callback) {

  /** TODO Validations */

  collection.update({"meetingId": meetingId},
    {
      "$set": {
        "topLocations": locations
      }
    }, function(err, result) {

      if (err) {
        logger.error("Error setting top locations for " + meetingId + " in mongo.")
      }
      callback(err, result)

  })

}
