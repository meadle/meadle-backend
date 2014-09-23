
var async = require("async");
var geo = require("../util/geo");
var logger = require("log4js").getLogger();
var meetingModel = require("../models/meeting");
var mongoUsers = require("../util/mongo_users");
var mongoMeetings = require("../util/mongo_meetings");
var yelp = require("../util/yelp");
