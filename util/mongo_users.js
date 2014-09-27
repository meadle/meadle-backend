
/** util/mongo_users.js
    contains functions which wrap mongodb functionality pertaining to storing
    and retrieving user objects
    each user object is keyed to a specific userId (a.k.a GCM ID) and a
    corresponding meetingId
*/

var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("users")
var logger = require("log4js").getLogger()
var userModel = require("../models/user")


/** Retrieves a user keyed to their userId (gcm) and their corresponding meeting Id

    @param userId     the userId of the user
    @param meetingId  the meetingId of which the user belongs
    @param callback   function(err, result)

    @returns callbacK(err)    an error if one is thrown by mongo
    @returns callback(result) the user object. see trello for more information.
*/
exports.getUser = function(userId, meetingId, callback) {
  logger.trace("mongo.getUser() : Getting user " + userId)

  collection.findOne({ "userId": userId, "meetingId":meetingId }, function(err, result) {

    if (err) {
      logger.error("Error while reading user " + userId + " from database")
    }
    callback(err, result)

  });

}


/** Adds a user to the mongodb collection

    @param userObject   the user object we are adding
                        this object should contain "userId", "meetingId", "lat", and "lng" fields
                        this function will fail if the object is not of this type
    @param callback     function(err, result)

    @returns callback(err)    an error if one is thrown
    @returns callback(result) nothing important
*/
exports.createUser = function(userObject, callback) {
  logger.trace("mongo.createUser() : Creating user " + userObject.userId)

  // Validate to ensure the added user is good
  if (!userModel.validate(userObject)) {
    callback("User object provided did not follow the proper schema", null)
    return
  }

  exports.getUser(userObject.userId, userObject.meetingId, function(err, result) {

    if (err) {
      logger.error("Error while getting user to avoid duplicate entries")
      callback(err, result)
      return
    }

    if (result) {
      logger.warn("Attempting to add user which already exists in mongo. Returning userobj that already exists.")
      callback(err, result)
      return
    }

    // Actually create the user
    collection.insert(userObject, function(err, result) {

      if (err) {
        logger.error("Error creating new user in mongo");
      }
      callback(err, result)

    });

  })

}
