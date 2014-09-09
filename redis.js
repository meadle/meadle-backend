
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

exports.setUsrLng = function(userId, lng) {
  redis.set(userId + "-longitude", lng);
}

/** MEETING DATA */

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
