
var async = require("async");
var db = require("mongoskin").db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/meadle");

exports.init = function() {

  async.parallel(

    [
      function(callback) {
        db.createCollection("users", function(err, collection) {

        });
      },
      function(callback) {
        db.createCollection("meetings", function(err, collection) {

        });
      }
    ],

    function(err, results) {

    }

  )

}
