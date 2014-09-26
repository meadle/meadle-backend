
var logger = require("log4js").getLogger()
var resbldr = require("../util/res_sender")

module.exports = function(req, res) {
  logger.info("GET /")
  resbldr.sendOK(res, "Everything looks to be in order")
}
