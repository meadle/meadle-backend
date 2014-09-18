
// Imports
var express = require('express');
var log4js = require('log4js');
var logger = log4js.getLogger();
var mongo = require('./util/mongo_init');
var meetingRoute = require('./routes/meeting');
var gcm = require('./util/gcm')('AIzaSyAHjol3Ke9-HGOl9O4wEWl8r9lwvnjqkVo');

// Express
var app = express();
app.use(express.json());

// Simple 200 return on route to / for codeship's ping to heroku on deploy
app.get("/", function(req, res) {
	res.status(200).send("A-OK");
});

// Defining routes
app.get("/meeting/:meetingId", meetingRoute.getMeeting);
app.post("/meeting", meetingRoute.postMeeting);
app.put("/meeting/:meetingId/join", meetingRoute.joinMeeting);

// Set up mongo db
mongo.init(function(err, results) {

	// If there is an error creating the collections, kill the server
	if (err) {
		logger.fatal("Exiting server");
		process.exit(1);
	}

});

// Get port
// Heroku sets the port of the app as an environment variable, but if you run locally it will
// default to 3000
var port = process.env.PORT || 3000;

// Start server
var server = app.listen(port, function() {
	logger.info("Listening on port " + server.address().port);
});

// Export the express application for use in test cases
module.exports = app;
