
var async = require("async");
var db = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle");
var logger = require("log4js").getLogger();

exports.init = function(callback) {
  logger.trace("mongo.init() : Initializing mongo database collections.");

  async.parallel( [ initUsers, initMeetings ],

    function(err, results) {

      if (err) {
        logger.fatal("Error during mongo initialization.");
      }
      callback(err, results);

    }

  )

}

var initUsers = function(callback) {

  db.createCollection("users", function(err, collection) {

    if (err) {
      logger.error("Error creating mongo users collection");
    }
    callback(err, collection);

  });

}

var initMeetings = function(callback) {

  db.createCollection("meetings", function(err, collection) {

    if (err) {
      logger.error("Error creating mongo meetings collection");
    }
    callback(err, collection);

  });

}
