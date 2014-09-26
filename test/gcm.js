var gcm = require('../util/gcm')('AIzaSyAHjol3Ke9-HGOl9O4wEWl8r9lwvnjqkVo');

describe('Google Cloud Messaging', function() {
		it('send a push notification to gcm device', function() {
			return gcm.sendNotification(['abc'], { key: 'value' }, true).then(function(result) {
				return result.statusCode.should.equal(200);
		});
	});
});
