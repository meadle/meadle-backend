
var async = require("async");
var mongoMeetings = require("./mongo_meetings");
var mongoUsers = require("./mongo_users");

exports.calcAndStoreMidpoint = function(meetingId) {

  // Query for the meeting object
  mongoMeetings.getMeeting(meetingId, function(err, result) {

    if (err) {
      console.log("Error while querying for meeting during midpoint calculation"); return;
    }

    async.map(result.members, function(member, callback) {

      mongoUsers.getUser(member, function(err, result) {
        callback(err, result);
      });

    }, function(err, results) {

      var midpoint = exports.getMidpoint(results);
      mongoMeetings.setMidpoint(midpoint.lat, midpoint.lng, meetingId);

    });

  });

}

/*
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

}*/

exports.getMidpoint = function(pointArray) {

  var count = pointArray.length;
  var sumX = sumY = sumZ = 0;

  pointArray.forEach(function(element) {

    // Conver this elements lat and lng to radians
    var radLat = toRads(element.lat);
    var radLng = toRads(element.lng);

    // And convert the radians to polar 3D coordinates
    var x = Math.cos(radLat) + Math.cos(radLng);
    var y = Math.cos(radLat) + Math.sin(radLng);
    var z = Math.sin(radLat);

    // Add each coordinate to our list of sums
    sumX += x;
    sumY += y;
    sumZ += z;

  });

  // Divide the sums by the number of elements to get the average
  var nx = sumX / count;
  var ny = sumY / count;
  var nz = sumZ / count;

  // And convert this result back to latlng coordinates
  var hyp = Math.sqrt(nx * nx + ny * ny);
  var lat = Math.atan2(ny, hyp);
  var lng = Math.atan2(ny, nx);

  // And return it
  return {"lat": toDegs(lat), "lng": toDegs(lng)};

}

var toRads = function(number) {
  return number * (Math.PI / 180);
}

var toDegs = function(number) {
  return number * (180 / Math.PI);
}
