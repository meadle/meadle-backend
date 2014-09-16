
var async = require("async");
var geo = require("../util/geo");
var logger = require("log4js").getLogger();
var meetingModel = require("../models/meeting");
var mongoUsers = require("../util/mongo_users");
var mongoMeetings = require("../util/mongo_meetings");
var yelp = require("../util/yelp");

exports.getMeeting = function(req, res) {

	// Extract the meeting id from the request parameters
	var meetingId = req.param("meetingId")

	// Extract the user Id
	var userId = req.param("userId")

	// Log it out here so we have the meeting and user Ids
	logger.info("GET /meeting/" + meetingId + "by user " + userId);

	// Query mongo for the meeting
	mongoMeetings.getMeeting(meetingId, function(err, result) {

		if (err) {
			logger.error("Mongo returned an error on query. Sending 500 to client.");
			res.status(500).send("An error occured in mongo."); return;
		}

		if (!result) {
			logger.warn("Queried meeting id " + meetingId + " does not exist in mongo. Returning 404 to client.");
			res.status(404).send({"error":404, "message": "The requested meadle could not be found."}); return;
		}

		// Check to ensure the requesting user has permission to request the meeting
		var members = result.members;
		if (members.indexOf(userId) === -1) {
			logger.warn("The client is not authorized to view meeting " + meetingId + ", sending 401.");
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

	if (!me || !lat || !lng || !datetime) {
		logger.warn("Client supplied an illformatted POST body. Sending 400.");
		res.status(400).send({"error":400, "message": "POST body was not formatted correctly."}); return;
	}

	// Generate a random meeting id
	var mid = Math.random().toString(36).substring(5);

	// Create the user in mongo
	mongoUsers.createUser({"userId": me, "lat": lat, "lng": lng});

	// Create the meeting
	mongoMeetings.createMeeting({"meetingId": mid, "datetime": datetime, "members": [me]});

	// Pass back the meeting id to the client
	res.status(201).send({"meetngId": mid});

}

exports.joinMeeting = function(req, res) {

	// Extract from post data
	var meetingId = req.param("meetingId");
	var me = req.body.userId;
	var lat = req.body.lat;
	var lng = req.body.lng;

	if (!meetingId || !me || !lat || !lng) {
		logger.warn("Client supplied illformatted PUT body. Sending 400");
		res.status(400).send({"error":400, "message":"PUT body was not formatted correctly."}); return;
	}

	// Create the user in mongo
	mongoUsers.createUser({"userId": me, "lat": lat, "lng": lng});

	// Get the meeting in question
	mongoMeetings.getMeeting(meetingId, function(err, result) {

			if (err) {
				logger.error("Mongo threw an error during getMeeting on PUT new meeting member");
				logger.error(err);
				res.status(500).send({"error": 500, "message": "An internal error occured (1)."}); return;
			}

			if (result.members.length >= 2) {
				logger.warn("User " + me + " tried to join a meeting that already has 2 members.");
				res.status(403).send({"error": 403, "message": "Meetings can only have two participants."}); return;
			}

			// Add the member to the meeting
			mongoMeetings.addMember(me, meetingId);

			// Calculate and store the midpoint in mongo
			geo.calcAndStoreMidpoint(meetingId, function(err, result) {

				if (err) {
					logger.error("An error was thrown during midpoint calculation");
					logger.error(err);
					res.status(500).send({"error": 500, "message": "An internal error occured (2)"});
					return;
				}

				// Query yelp for the businesses
				yelp.getBusinesses(result, function(err, results) {

					if (err) {
						logger.error("An error was thrown during the yelp API call");
						logger.error(err);
						res.status(500).send({"error":500, "message": "An internal error occured (3)"});
						return;
					}

					// Results should be a list of business IDs. Store them in mongo.
					mongoMeetings.setTopLocations(meetingId, results);

				});

			});

	});

	res.status(202).send("Accepted");

}
