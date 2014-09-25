var logger = require('log4js').getLogger();
var request = require('request');
var Q = require('q');

module.exports = function(gcmKey) {
	return {
		sendNotification: function(registrationIds, data, dry_run) {
			// This probably doesn't need to be an async function because 
			// I have observed GCM responding to requests in under a second historically.

			// Valid requestBody params can be found here: http://developer.android.com/google/gcm/server.html#params
			var requestBody = {
				'registration_ids'	: registrationIds,
				'data'				: data,
			};

			var promise = Q.defer();

			request.post({url: 'https://android.googleapis.com/gcm/send', body: requestBody, json:true, headers: { 'Authorization': 'key=' + gcmKey, 'Content-Type': 'application/json' }}, function(err, msg, body) {
				if(err) {
					// TODO: If error, then retry after time that we are supposed to wait. 
					// TODO: If registration_ids error, then raise error
					promise.reject(msg);
				} else {
					promise.resolve(msg);	
				}
			});

			return promise.promise;
		}
	}
};
