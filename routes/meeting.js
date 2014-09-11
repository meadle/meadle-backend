
var async = require("async");
var meetingModel = require("../models/meeting");
var mongoUsers = require("../util/mongo_users");
var mongoMeetings = require("../util/mongo_meetings");
var geo = require("../util/geo");

exports.getMeeting = function(req, res) {

	// Extract the meeting id from the request parameters
	var meetingId = req.param("meetingId")

	// Extract the user Id
	var userId = req.param("userId")

	// Query mongo for the meeting
	mongoMeetings.getMeeting(meetingId, function(err, result) {

		if (err) {
			res.status(400).send("An error occured in mongo."); return;
		}

		// Check to ensure the requesting user has permission to request the meeting
		var members = result.members;
		if (members.indexOf(userId) === -1) {
			res.status(401).send("Unauthorized"); return;
		}

		// Filter the meeting of any sensitive information
		var meeting = meetingModel.filter(result);

		// Send the result to the client
		res.status(200).send(meeting);

	});

}

exports.postMeeting = function(req, res) {

	// Extract data from the post data
	var me = req.body.userId;
	var lat = req.body.lat;
	var lng = req.body.lng;
	var datetime = req.body.datetime;

	// Generate a random meeting id
	var mid = Math.random().toString(36).substring(5);

	// Create the user in mongo
	mongoUsers.createUser({"userId": me, "lat": lat, "lng": lng});

	// Create the meeting
	mongoMeetings.createMeeting({"meetingId": mid, "datetime": datetime, "members": [me]});

	// Pass back the meeting id to the client
	res.status(201).send({"meetingId": mid});

}

exports.joinMeeting = function(req, res) {

	// Extract from post data
	var meetingId = req.param("meetingId");
	var me = req.body.userId;
	var lat = req.body.lat;
	var lng = req.body.lng;

	// Create the user in mongo
	mongoUsers.createUser({"userId": me, "lat": lat, "lng": lng});

	// Get the meeting in question
	var meeting = mongoMeetings.getMeeting(meetingId, function(err, result) {

			if (err) {
				res.status(400).send("An error occured in mongo."); return;
			}

			// Add the member to the meeting
			mongoMeetings.addMember(me, meetingId);

			// TODO Calculate midpoint and GCM them

	});

}
