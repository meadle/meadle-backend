
exports.filter = function(yelpBusiness) {

  var newBusiness = {};

  // Get all the fields we care about
  newBusiness.id = yelpBusiness.id;
  //newBusiness.name = yelpBusiness.name;
  //newBusiness.distance = yelpBusiness.distance;

  return newBusiness;

}
