
var async = require("async");
var db = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle");
var logger = require("log4js").getLogger();

exports.init = function() {
  logger.trace("mongo.init() : Initializing mongo database collections.");

  async.parallel(

    [
      function(callback) {
        db.createCollection("users", function(err, collection) {

          if (err) {
            logger.error("Error creating mongo users collection");
          }
          callback(err, collection);

        });
      },
      function(callback) {
        db.createCollection("meetings", function(err, collection) {

          if (err) {
            logger.error("Error creating mongo meetings collection");
          }
          callback(err, collection);

        });
      }
    ],

    function(err, results) {

      if (err) {
        logger.fatal("Error during mongo initialization.");
      }

    }

  )

}
