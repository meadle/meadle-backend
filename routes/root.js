
var logger = require("log4js").getLogger()
var responder = require("../util/response")

module.exports = function(req, res) {
  logger.info("GET /")
  responder.sendOk(res, {'status': 200, 'message': 'Everything looks to be in good order.'})
}
