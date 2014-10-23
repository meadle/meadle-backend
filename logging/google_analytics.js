
var logger = require('log4js').getLogger()
var md5 = require('MD5')
var request = require('request')

var tracking_id = 'UA-56027215-1'

exports.hit = function(userId, page) {

  var type = 'pageview'

  var hashedid = md5(userId)
  var url = 'http://google-analytics.com/collect?' +
            'v='    + '1'           + '&' +
            'tid='  + tracking_id   + '&' +
            'cid='  + hashedid      + '&' +
            't='    + type          + '&' +
            'dh='   + 'meadle.me'   + '&' +
            'dp='   + page

  request({
    'method':'POST',
    'uri': url,

  }, function(err, response, body) {

    if (err) {
      logger.error('Error sending api hit to google analytics')
      logger.error(err)
    }
    
  })

}
