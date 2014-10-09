
var async = require('async')
var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("meetings")
var logger = require("log4js").getLogger()
var mongoUsers = require("./mongo_users")

/*
 * Returns a meeting object stored by meetingId in mongo
 *
 * @param meetingId   the meeting Id the backend generates in POST /meeting
 * @param callback    function(err, result)
 *
 * @returns callback(result)  the meeting object stored in mongo
 * @returns callback(err)     if error occurs in mongo
 */
exports.getMeeting = function(meetingId, callback) {
  logger.trace("mongo.getMeeting() : Retrieving meeting by id " + meetingId)

  collection.findOne({"meetingId": meetingId}, function(err, result) {

    if (err) {
      logger.error("Error while reading meeting " + meetingId + " from database.")
      logger.error(err)
    }
    callback(err, result)

  })

}

/*
 * Creates a meeting in mongo.
 *
 * @param   meeting   a meeting object with the field 'id', 'datetime', and 'members' set
 *    see trello for further documentation
 * @param   callback  function(err, result)
 *
 * @returns callback  result  honestly im not sure what is inside this object. not important.
 * @returns callback  err     if an error occurs in mongo
 */
exports.createMeeting = function(meeting, callback) {
  logger.trace("mongo.createMeeting() : creating meeting with id " + meeting.meetingId)

  // TODO: Add validation

  collection.insert(meeting, function(err, result) {

    if (err) {
      logger.error("Error while creating meeting in mongo.")
    }
    callback(err, result)

  })

}

/*
 * Adds a member by userId to a meeting in mongo.
 *
 * @param meetingId the meeting id generated by POST /meeting
 * @param userId    the userId provided by the client
 * @param callback  function(err, result)
 *
 * @returns callback(err)     if an error occurs in mongo
 * @returns callback(result)  not sure if anything useful is in here
 */
exports.addMember = function(meetingId, userId, callback) {
  logger.trace("mongo.addMember() : adding member " + userId + " to meeting " + meetingId)

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

/*
 * Sets the midpoint of the meeting in lat/lng for a given meeting id
 *
 * @param meetingId   the meeting id generated by POST /meeting
 * @param latitude    double. latitude of the meeting
 * @param longitude   double. longitude of the meeting
 * @param callback    function(err, result)
 *
 * @returns callback(err)     if an error occurs
 * @returns callback(result)  nothing useful
 */
exports.setMidpoint = function(meetingId, latitude, longitude, callback) {
  logger.trace("mongo.setMidpoint() : setting midpoint (" + latitude + ", " + longitude + ") on meeting " + meetingId)

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

/*
 * Sets the top locations for a given meeting.
 *
 * @param meetingId   the meetingId generated by POST /meeting
 * @param locations   array of strings. each entry is a yelp Id
 * @param callback    function(err, result)
 *
 * @returns callback(err)     if an error occurs
 * @returns callback(result)  nothing useful
 */
exports.setTopLocations = function(meetingId, locations, callback) {
  logger.trace("mongo.setTopLocations() : setting list of top locations on meeting " + meetingId)
  logger.trace("  " + locations)

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
    }
  )

}

/*
 * Sets the final location for a given meeting
 *
 * @param meetingId     the meetingId generated by POST /meeting
 * @param finalLocation the yelpId of the final location for the meeting
 * @param callback      function(err, result)
 *
 * @returns callback(err)     if an error occurs
 * @returns callback(result)  nothing important
 */
exports.setFinalLocation = function(meetingId, finalLocation, callback) {
  logger.trace("mongo.setFinalLocation() : setting final location " + finalLocation + " for meeting " + meetingId)

  collection.update({"meetingId": meetingId},
    {
      "$set": {
        "finalLocation": finalLocation
      }
    }, function(err, result) {

      if (err) {
        logger.error("Error setting final location for " + meetingId + " in mongo")
      }
      callback(err, result)

    }
  )

}

/*
 * Increments the number of users who have voted on the meeting
 *
 * @param meetingId     the meetingId generated by POST /meeting
 * @param callback      function(err, result)
 *
 * @returns callback(err)   if an error occurs
 * @returns callback(res)   the new number of users in the meeting
 */
exports.incrementNVoted = function(meetingId, callback) {
  logger.trace("mongo.incrementNVoted() : incrementing the number of people who have voted on the meeting")

  collection.update({"meetingId": meetingId},
    {
      "$inc": {
        "nVoted": 1
      }
    }, function(err, result) {
      if (err) {
        logger.error("Error incrementing number of users voted on meeting")
      }
      exports.getMeeting(meetingId, function(err, result) {
        if (err) {
          logger.error("Error getting new meeting after incrementing nvoted")
        }
        callback(err, result)
      })
    }
  )

}
