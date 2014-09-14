
var logger = require("log4js").getLogger();
var yelp = require('../util/yelp');

/** I just kind of use this to test code as im writing it. Nothing official and its cleaner than
 *  editing server.js every time. */
exports.run = function() {
  logger.trace("Running pre-start tests");


  logger.trace("Pre-start tests completed successfully");
}
