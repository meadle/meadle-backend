
var redis = require('redis').createClient(6379, "54.88.42.9", {});

exports.getMeeting = function(req, res) {
	res.send("Hello world.");
}

exports.postMeeting = function(req, res) {
	redis.set("name", req.body.name);
	redis.get("name", function(err, result) {
		res.send(result);
	});
}
