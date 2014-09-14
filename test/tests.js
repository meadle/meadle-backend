
var yelp = require('../util/yelp');

/** I just kind of use this to test code as im writing it. Nothing official and its cleaner than
 *  editing server.js every time. */
exports.run = function() {

  yelp.getBusinesses({"lat": 34, "lng":-86}, function(err, result) {
    console.log(result);
  })

}
