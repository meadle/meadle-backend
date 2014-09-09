
var redis = require("../redis")

exports.getMeeting = function(req, res) {

	// Extract the meeting id from the request parameters
	var meetingId = req.param("meetingId")

	// Start extracting information from redis
	var meeting = {}

	var lat = redis.getUserLat("123", function(err, result) {

		res.send(result);
	});

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
