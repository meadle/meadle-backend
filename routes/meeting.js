
var async = require("async");
var mongoUsers = require("../util/mongo_users");
var geo = require("../util/geo");

exports.getMeeting = function(req, res) {

	// Extract the meeting id from the request parameters
	var meetingId = req.param("meetingId")

	// Extract the user Id
	var userId = req.param("me")

	mongoUsers.getUser(userId, function(err, result) {
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

}

exports.joinMeeting = function(req, res) {

	// Extract from post data
	var meetingId = req.param("meetingId");
	var me = req.body.me;
	var lat = req.body.lat;
	var lng = req.body.lng;

}
