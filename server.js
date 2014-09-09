
// Imports
var express = require('express');

// Routes
var meetingRoute = require('./routes/meeting');

// Express
var app = express();
app.use(express.json());

// Defining routes
app.get("/meeting/:meetingId", meetingRoute.getMeeting);
app.post("/meeting", meetingRoute.postMeeting);
app.put("/meeting/:meetingId/join", meetingRoute.joinMeeting);

// Get port
// Heroku sets the port of the app as an environment variable, but if you run locally it will
// default to 3000
var port = process.env.PORT || 3000;

// Start server
var server = app.listen(port, function() {
	console.log("Listening on port", server.address().port);
});
