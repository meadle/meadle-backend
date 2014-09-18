var logger = require('log4js').getLogger();
var request = require('request');

module.exports = function(gcmKey) {
	return {
		sendNotification = function(registrationIds, data, dry_run) {
			// This probably doesn't need to be an async function because 
			// I have observed GCM responding to requests in under a second historically.

			// Valid requestBody params can be found here: http://developer.android.com/google/gcm/server.html#params
			var requestBody = {
				'registration_ids'	: registrationIds,
				'data'				: data,
			};

			request.post({url: 'https://android.googleapis.com/gcm/send', body: requestBody, json:true}, function(err, msg, body) {
				// TODO: Handle response
			});
		}
	}
};
