
var yelpModel = require('../models/yelp_business');
var logger = require("log4js").getLogger();

// This stuff should be removed if we ever eventually go open source, obviously
var CONSUMER_KEY = "nvpSLg2B6XPhM-z6_XA-XQ";
var CONSUMER_SECRET = "6601ZahPsWoTtfXh3RLV3ZQ1cpo";
var TOKEN = "VZwMKj67z6K0W_djNdxXFz8So8ml4MUf";
var TOKEN_SECRET = "HFHxXEbUqhv_t1d2cpxmU6s9rC0";

// Constants we use during searching
var SEARCH_RADIUS_M = 5000;

// Create the yelp API client
logger.trace("Initializing yelp API client");
var yelp = require("yelp").createClient({
  "consumer_key": CONSUMER_KEY,
  "consumer_secret": CONSUMER_SECRET,
  "token": TOKEN,
  "token_secret": TOKEN_SECRET
});

exports.getBusinesses = function(point, callback) {
  logger.trace("yelp.getBusinesses() : Getting businesses around " + point.lat + ", " + point.lng);

  yelp.search(
    {
      "term": "food",
      "ll": "" + point.lat + "," + point.lng
    },
    function(err, result) {

      if (err) {
        logger.error("Error in yelp.getBusinesses()");
        logger.error(err);
        callback(err, null);
        return;
      }

      if (result.businesses.length === 0) {
        logger.warn("Yelp API call returned a list of businesses of zero length.");
      }

      // Extract the exact information we need for each result
      var items = [];
      result.businesses.forEach(function(item) {
        items.push(yelpModel.filter(item));
      });

      // Return them
      callback(err, items);

    }
  )

}
