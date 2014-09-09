
var redis = require('redis').createClient(6379, "54.88.42.9", {});

/** USER DATA **/

exports.getUserLat = function(userId, callback) {
  redis.get(userId + "-latitude", function(err, result) {
    callback(err, result);
  });
}

exports.setUserLat = function(userId, lat) {
  redis.set(userId + "-latitude", lat);
}

exports.getUserLng = function(userId, callback) {
  redis.get(userId + "-longitude", function(err, result) {
    callback(err, result);
  });
}

exports.setUserLng = function(userId, lng) {
  redis.set(userId + "-longitude", lng);
}

/** PUBLIC MEETING DATA */

exports.getMeetingStage = function(meetingId, callback) {
  redis.get(meetingId + "-meet-stage", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingStage = function(meetingId, stage) {
  redis.set(meetingId + "-meet-stage", stage);
}

exports.getMeetingInitiator = function(meetingId, callback) {
  redis.get(meetingId + "-meet-initiator-id", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingInitiator = function(meetingId, userId) {
  redis.set(meetingId + "-meet-initiator-id", userId);
}

exports.getMeetingJoiner = function(meetingId, callback) {
  redis.get(meetingId + "-meet-joiner-id", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingJoiner = function(meetingId, userId) {
  redis.set(meetingId + "-meet-joiner-id", userId);
}

exports.getMeetingTime = function(meetingId, callback) {
  redis.get(meetingId + "-meet-time", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingTime = function(meetingId, time) {
  redis.set(meetingId + "-meet-time", time);
}

exports.getMeetingCategory = function(meetingId, callback) {
  redis.get(meetingId + "-meet-category", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingCategory = function(meetingId, category) {
  redis.set(meetingId + "-meet-category", category);
}

exports.getMeetingLocation = function(meetingId, callback) {
  redis.get(meetingId + "-meet-location", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingLocation = function(meetingId, location) {
  redis.set(meetingId + "-meet-location", location);
}

/** PRIVATE MEETING DATA */

exports.getMeetingMidpointLat = function(meetingId, callback) {
  redis.get(meetingId + "-meet-midpoint-lat", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingMidpointLat = function(meetingId, lat) {
  redis.set(meetingId + "-meet-midpoint-lat", lat);
}

exports.getMeetingMidpointLng = function(meetingId, callback) {
  redis.get(meetingId + "-meet-midpoint-lng", function(err, result) {
    callback(err, result);
  });
}

exports.setMeetingMidpointLng = function(meetingId, lng) {
  redis.set(meetingId + "-meet-midpoint-lng", lng);
}

/** COMPOSITE HELPER METHODS */

exports.getUserLocation = function(userId, mCallback) {
  var location = {}

  async.parallel(
    [
      function(callback) {
        exports.getUserLat(userId, function(err, result) {
          location.lat = result;
          callback(err, result);
        })
      },
      function(callback) {
        exports.getUserLng(userId, function(err, result) {
          location.lng = result;
          callback(err, result);
        })
      }
    ],
    function(err, results) {
      mCallback(err, location);
    }
  )

}

exports.getInitiatorLocation = function(meetingId, callback) {

  exports.getMeetingInitiator(meetingId, function(err, result) {

    var userId = result;
    exports.getUserLocation(userId, function(err, result) {
      callback(err, result);
    });

  });

}

exports.getMeetingMidpoint = function(meetingId, mCallback) {

  var location = {}

  async.parallel(
    [
      function(callback) {
        exports.getMeetingMidpointLat(meetingId, function(err, result) {
          location.lat = result;
          callback(err, result);
        });
      },
      function(callback) {
        exports.getMeetingMidpointLng(meetingId, function(err, result) {
          location.lng = result;
          callback(err, result);
        });
      }
    ],

    function(err, results) {
      mCallback(err, location);
    }
  );

}
