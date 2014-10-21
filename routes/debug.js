
var comeback = require('comeback')
var gcm = require('../util/gcm')
var logger = require('log4js').getLogger()
var responder = require('../util/response')

exports.sendUserJoinedGcm = function(req, res) {

  var gcmid = req.param['gcm']

  gcm.sendUserJoined([gcmid], "userId12345")

  comeback.ok(res, {})

}
