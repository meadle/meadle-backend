var gcm = require('../util/gcm')('AIzaSyAHjol3Ke9-HGOl9O4wEWl8r9lwvnjqkVo');

describe('gcm', function() {
	describe('sendNotification', function() {
		it('sends a push notification to GCM', function() {
			return gcm.sendNotification(['abc'], { key: 'value' }, true).then(function(result) {
				return result.statusCode.should.equal(200);
			});
		});
	});
});
