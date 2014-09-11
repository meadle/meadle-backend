
var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("users");

exports.getUser = function(userId, callback) {

  collection.findOne({"userId": userId}, function(err, result) {

    if (err) {
      console.log("Error while reading user " + userId + " from database");
    } else {
      console.log("User get from database complete");
      callback(err, result);
    }

  });

}

/** User object is of form:
 *  {
 *    "userId": "",
 *    "lat": 12.34,
 *    "lng": 12.34
 *  }
 */
exports.createUser = function(userObject) {

  // TODO: Add validation

  collection.insert(userObject);

}
