
var async = require("async");
var redis = require("../redis");

exports.getMeeting = function(req, res) {

	// Extract the meeting id from the request parameters
	var meetingId = req.param("meetingId")

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
				})
			},
			function(callback) {
				redis.getMeetingLocation(meetingId, function(err, result) {
					meeting.meeting.location = result;
					callback(err, result);
				})
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

var onGetMeetingStage = function(stage) {

}
