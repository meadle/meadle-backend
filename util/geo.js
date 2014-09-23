
var async = require("async");
var logger = require("log4js").getLogger();
var mongoMeetings = require("./mongo_meetings");
var mongoUsers = require("./mongo_users");

/** This function calculates the midpoint for a given meeting then stores that value
 *  in that meetings Mongo document. It also returns that value through the callback
 *  passed in for immediate usage if desired. */
exports.calcAndStoreMidpoint = function(meetingId, mCallback) {
  logger.trace("geo.calcAndStoreMidpoint() : Calculating and storing midpoint for " + meetingId);

  // Query for the meeting object
  mongoMeetings.getMeeting(meetingId, function(err, result) {

    if (err) {
      logger.error("Error getting meeting " + meetingId + " from mongo during midpoint calculation");
      mCallback(err, null); return;
    }

    async.map(result.members, function(member, callback) {

      mongoUsers.getUser(member, function(err, result) {
        callback(err, result);
      });

    }, function(err, results) {

      var midpoint = exports.getMidpoint(results);
      mongoMeetings.setMidpoint(midpoint.lat, midpoint.lng, meetingId, function(err, result) {
          mCallback(err, midpoint);
      });

    });

  });

}

exports.getMidpoint = function(pointArray) {

  var count = pointArray.length;
  var sumX = sumY = sumZ = 0;

  pointArray.forEach(function(element) {

    // Convert this elements lat and lng to radians
    var radLat = toRads(element.lat);
    var radLng = toRads(element.lng);

    // And convert the radians to polar 3D coordinates
    var x = Math.cos(radLat) * Math.cos(radLng);
    var y = Math.cos(radLat) * Math.sin(radLng);
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
  var lat = Math.atan2(nz, hyp);
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
