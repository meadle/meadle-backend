
var analytics = require('../logging/google_analytics')
var comeback = require('comeback')
var gcm = require('../util/gcm')
var logger = require('log4js').getLogger()

exports.sendUserJoinedGcm = function(req, res) {

  analytics.hit('test', '/debug/gcm/userJoin')

  var gcmid = req.param['gcm']
  gcm.sendUserJoined([gcmid], "userId12345")
  comeback.ok(res, {})

}
