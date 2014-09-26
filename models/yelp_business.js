
var logger = require("log4js").getLogger();

exports.filter = function(yelpBusiness) {
  logger.trace("models/yelp_business.filter() : Purging unnecessary data from yelp business " + yelpBusiness.id);

  var newBusiness = {};

  // Get all the fields we care about
  newBusiness.id = yelpBusiness.id;
  //newBusiness.name = yelpBusiness.name;
  //newBusiness.distance = yelpBusiness.distance;

  return newBusiness;

}
