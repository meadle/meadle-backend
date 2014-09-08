
// Imports
var express = require('express');
var redis = require('redis');

// Routes
var meetingRoute = require('./routes/meeting');

// Express
var app = express();
app.use(express.json());

// Defining routes
app.get("/meeting", meetingRoute.getMeeting);
app.post("/meeting", meetingRoute.postMeeting);

// Get port
var port = process.env.PORT || 3000;

// Start server
var server = app.listen(port, function() {
	console.log("Listening on port ", server.address().port);
});
