
exports.getMidpoint = function(lat1, lng1, lat2, lng2) {

  // convert to radians
  var rLat1 = toRads(lat1);
  var rLat2 = toRads(lat2);
  var rLng1 = toRads(lng1);
  var dLng = toRads(lng2 - lng1);

  // some crazy calculation made possible thanks to the generosity of stackoverflow
  var bX = Math.cos(rLat2) * Math.cos(dLng);
  var bY = Math.cos(rLat2) * Math.sin(dLng);
  var latMid = Math.atan2(Math.sin(rLat1) + Math.sin(rLat2), Math.sqrt((Math.cos(rLat1) + bX) * (Math.cos(rLat1) + bX) + bY * bY));
  var lngMid = rLng1 + Math.atan2(bY, Math.cos(rLat1) + bX);

  // Convert and return in degrees
  return {"lat": toDegs(latMid), "lng": toDegs(lngMid)};

}

var toRads = function(number) {
  return number * (Math.PI / 180);
}

var toDegs = function(number) {
  return number * (180 / Math.PI);
}
