
// Imports
var express = require('express');
var mongo = require('./util/mongo_init');
var logger = require('log4js').getLogger();

// Setup logger
require('./logging/log4js_setup')()

// Express
var app = express();
app.use(express.json());

// Defining routes
app.get("/", require("./routes/root"))
app.get("/meeting/:meetingId", require("./routes/get_meeting"))
app.post("/meeting", require("./routes/create_meeting"))
app.put("/meeting/:meetingId/join", require("./routes/join_meeting"))

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
