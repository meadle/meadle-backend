
var async = require("async");
var redis = require("../util/redis_wrapper");
var geo = require("../util/geo");

exports.getMeeting = function(req, res) {

	// Extract the meeting id from the request parameters
	var meetingId = req.param("meetingId")

	// Extract the user Id
	var userId = req.param("me")

	// Start extracting information from redis
	var meeting = { meeting: {} }
	async.parallel(

		[
			function(callback) {
				redis.getMeetingStage(meetingId, function(err, result) {
					meeting.stage = result;
					callback(err, result);
				});
			},
			function(callback) {
				redis.getMeetingTime(meetingId, function(err, result) {
					meeting.meeting.datetime = result;
					callback(err, result);
				});
			},
			function(callback) {
				redis.getMeetingCategory(meetingId, function(err, result) {
					meeting.meeting.category = result;
					callback(err, result);
				});
			},
			function(callback) {
				redis.getMeetingMidpoint(meetingId, function(err, result) {
					meeting.meeting.location = result;
					callback(err, result);
				});
			},
			function(callback) {
				redis.getMeetingMidpoint
			}
		],

		function(err, results) {
			meeting.id = meetingId;
			res.send(meeting);
		}

	);

}

exports.postMeeting = function(req, res) {

	// Extract data from the post data
	var me = req.body.me;
	var lat = req.body.lat;
	var lng = req.body.lng;
	var datetime = req.body.datetime;

	// Generate a random meeting id
	var mid = Math.random().toString(36).substring(5);

	// Commit data about the meeting to redis
	redis.setMeetingStage(mid, 1);
	redis.setMeetingInitiator(mid, me);
	redis.setMeetingTime(mid, datetime);

	// Commit data about the initiator to redis
	redis.setUserLat(me, lat);
	redis.setUserLng(me, lng);

	// Turn the meeting ID to json and write it to the client
	res.send({"meetingId": mid})

}

exports.joinMeeting = function(req, res) {

	// Extract from post data
	var meetingId = req.param("meetingId");
	var me = req.body.me;
	var lat = req.body.lat;
	var lng = req.body.lng;

	// Get the meeting's stage and only continue if it is 1
	var stage = redis.getMeetingStage(meetingId, function(err, result) {
		if (stage === 1) {

			// Increment the meeting's stage
			redis.setMeetingStage(meetingId, 2);

			// Add information about this user to redis
			redis.setUserLat(me, lat);
			redis.setUserLng(me, lng);

			// Add this user to the meeting
			redis.setMeetingJoiner(meetingId, me);

			// Get the first user's location
			var location = redis.getInitiatorLocation(meetingId, function(err, result) {

				// Calculate the midpoint between the two users
				var midpoint = geo.getMidpoint(lat, lng, location.lat, location.lng);

				// Store it in redis
				redis.setMeetingMidpointLat(midpoint.lat);
				redis.setMeetingMidpointLng(midpoint.lng);

			});

		}
	});

}
