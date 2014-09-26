
/** Setup code for log4js
    You can still get the standard logger with require("log4js"), but this
    will be called during the setup process to set log4js' configuration stuff */

var log4js = require("log4js")
var logger = log4js.getLogger()

module.exports = function() {
  logger.trace("log4js_setup() : Setting up logging output format")

  log4js.configure(

    {
      appenders: [
        {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: "%[[%5.5p]%] %m"
          }
        }
      ]
    }

  )

}
