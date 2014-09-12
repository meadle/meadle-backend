
var async = require("async");
var mongoMeetings = require("./mongo_meetings");
var mongoUsers = require("./mongo_users");

exports.calcAndStoreMidpoint = function(meetingId) {

  // Query for the meeting object
  mongoMeetings.getMeeting(meetingId, function(err, result) {

    if (err) {
      console.log("Error while querying for meeting during midpoint calculation"); return;
    }

    // Full member data for each meeting are stored in an array
    var members = [];

    // Generate a query function for each member in the meeting
    var queries = [];
    result.members.forEach(function(a) {

      if (!a) {
        return;
      }

      queries.push(function(callback) {
        mongoUsers.getUser(a, function(err, result) {

          if (err) {
            console.log("Good luck debugging this one buddy");
          } else {
            console.log("Adding " + result);
            members.push(result);
            callback(result);
          }

        });
      });
    });

    // Then execute each of the functions we just generated
    async.parallel(queries,

      function(err, results) {

        // For each member, calculate their midpoint
        // Right now this will only calculate the midpoint between... uhh... the first two
        // But eventually we could improve this to work for an arbitrary number of people

        var m1 = members[0];
        var m2 = members[1];
        var midpoint = exports.getMidpoint(m1.lat, m1.lng, m2.lat, m2.lng);

        mongoMeetings.setMidpoint(midpoint.lat, midpoint.lng, meetingId);

      }

    );

  });

}

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
