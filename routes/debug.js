
var gcm = require('../util/gcm')
var logger = require('log4js').getLogger()

exports.sendUserJoinedGcm = function(req, res) {

  var gcmid = req.param['gcm']

  gcm.sendUserJoined([gcmid], "userId12345")

  res.status(200).send({})

}
