
var logger = require('log4js').getLogger();
var request = require('request');
var Q = require('q');

var gcmkey = "AIzaSyAHjol3Ke9-HGOl9O4wEWl8r9lwvnjqkVo"

exports.sendUserJoinedGcm = function(sendIds, joinedId, dryrun) {
	var data = {
		'phase': 'JOINED',
		'userId': userId
	}
	sendMessage(sendIds, data, dryrun)
}

exports.sendVotingStarted = function(sendIds, topLocations, dryrun) {
	var data = {
		'phase': 'START_VOTING',
		'topLocations': topLocations
	}
	sendMessage(sendIds, data, dryrun)
}

exports.sendVotingFinished = function(sendIds, finalLocation, dryrun) {
	var data = {
		'phase': 'END_VOTING',
		'location': finalLocation
	}
	sendMessage(sendIds, data, dryrun)
}

var sendMessage = function(ids, data, dryrun) {

	var requestBody = {
		'registration_ids': ids,
		'data': data
	}

	var promise = Q.defer()

	var requestOptions = {
		'url': 'https://android.googleapis.com/gcm/send',
		'body': requestBody,
		'json': true,
		'headers': {
			'Authorization': 'key=' + gcmkey,
			'Content-Type': 'application/json'
		}
	}

	var doGcmRequest = function() {
		request.post(requestOptions, handleGcmResponse)
	}
	doGcmRequest()

	var handleGcmResponse = function() {

		if (err) {
			if (msg.statusCode >= 500 && msg.statusCode <= 599) {
				setTimeout(msg.getHeader('Retry-After'), doGcmRequest)
				return
			}
			promise.reject(msg)
			return
		}
		promise.resolve(msg)
	}

	return promise.promise

}
