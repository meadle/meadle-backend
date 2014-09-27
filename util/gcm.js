
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

			var requestOptions = {
				url: 'https://android.googleapis.com/gcm/send',
				body: requestBody,
				json: true,
				headers: {
					'Authorization': 'key=' + gcmKey,
					'Content-Type': 'application/json'

				}
			};

			function doGcmRequest(requestOptions) {
				request.post(requestOptions, handleGcmResponse);
			}

			function handleGcmResponse(err, msg, body) {
				if(err) {
					// TODO: If registration_ids error, then raise error
					if(msg.statusCode >= 500 && msg.statusCode <= 599) {
						// Errors in the 500-599 range (such as 500 or 503) indicate that
						// there was an internal error in the GCM server while trying to
						// process the request, or that the server is temporarily unavailable
						// (for example, because of timeouts). Sender must retry later, honoring
						// any Retry-After header included in the response.
						setTimeout(msg.getHeader('Retry-After'), doGcmRequest(requestOptions));
						return;
					}
					promise.reject(msg);
				} else {
					promise.resolve(msg);
				}
			}

			doGcmRequest(requestOptions);

			return promise.promise;
		}
	}
};
