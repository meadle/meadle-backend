
// Imports
var express = require('express');
var log4js = require('log4js');
var tests = require('./test/tests');

// Routes
var meetingRoute = require('./routes/meeting');
var mongo = require('./util/mongo_init');

// Logging
var logger = log4js.getLogger();

// Express
var app = express();
app.use(express.json());
app.use(log4js.connectLogger(logger));

// Defining routes
app.get("/meeting/:meetingId", meetingRoute.getMeeting);
app.post("/meeting", meetingRoute.postMeeting);
app.put("/meeting/:meetingId/join", meetingRoute.joinMeeting);

// Set up mongo db
mongo.init();

// Initiate pre-run tests
// I just use this function to expedite testing of code I write so i dont have to modify server.js
tests.run();

// Get port
// Heroku sets the port of the app as an environment variable, but if you run locally it will
// default to 3000
var port = process.env.PORT || 3000;

// Start server
var server = app.listen(port, function() {
	console.log("Listening on port", server.address().port);
});
