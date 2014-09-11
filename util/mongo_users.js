
var collection = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle").collection("users");

exports.getUser = function(userId, callback) {

  collection.findOne({"userId": userId}, callback);

}
