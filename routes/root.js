
var logger = require("log4js").getLogger()

module.exports = function(req, res) {
  logger.info("GET /")
  res.status(200).send({'status': 200, 'message': 'Everything looks to be in good order.'})
}
