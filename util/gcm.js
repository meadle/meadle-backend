
var logger = require('log4js').getLogger();
var request = require('request');
var Q = require('q');

var gcmkey = "AIzaSyAHjol3Ke9-HGOl9O4wEWl8r9lwvnjqkVo"

var sendMessage = function(senderIds, data) {

	// Create the request options for our POST call to GCM servers
	var requestOptions = {
		'url': 'https://android.googleapis.com/gcm/send',
		'json': true,
		'headers': {
			'Authorization': 'key=' + gcmkey,
			'Content-Type': 'application/json'
		},
		'body': {
			'registration_ids': senderIds,
			'data': data
		}
	}

	// Do the request to gcm
	var doPost = function() {
		request.post(requestOptions, onPostComplete)
	}
	doPost()

	// This is called when the post is complete
	var onPostComplete = function(err, msg, body) {
		if (err) {
			if (msg.statusCode >= 500 && msg.statusCode <= 599) {
					setTimeout(doPost, msg.getHeader('Retry-After'));
			}
		}
	}

}

exports.sendUserJoined = function(senderIds, userIdJoined) {
	var data = {
		'phase': 'USER_JOINED',
		'userId': userId
	}
	sendMessage(senderIds, data)
}

exports.sendAllUsersJoined = function(senderIds, topLocations) {
	var data = {
		'phase': 'VOTING_STARTED',
		'topLocations': topLocations
	}
	sendMessage(senderIds, data)
}

exports.sendVotingFinished = function(senderIds, finalLocation) {
	var data = {
		'phase': 'VOTING_FINISHED',
		'location': finalLocation
	}
	sendMessage(senderIds, data)
}
