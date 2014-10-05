
var logger = require("log4js").getLogger()
var responder = require("../util/response")

module.exports = function(req, res) {
  logger.info("GET /")
  res.send("Meadle! The best way to find a place to meet someone!\n" +
    "You should totally just install the Meadle android application though.\n" +
    "We don't really have much of a website :(")
}
