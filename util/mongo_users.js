
var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("users")
var logger = require("log4js").getLogger()

exports.getUser = function(userId, callback) {

  collection.findOne({"userId": userId}, function(err, result) {

    if (err) {
      logger.error("Error while reading user " + userId + " from database")
    }
    callback(err, result)

  });

}

/** User object is of form:
 *  {
 *    "userId": "",
 *    "lat": 12.34,
 *    "lng": 12.34
 *  }
 */
exports.createUser = function(userObject, callback) {

  // TODO: Add validation

  collection.insert(userObject, function(err, result) {

    if (err) {
      logger.error("Error creating user in mongo");
    }
    callback(err, result)

  });

}
