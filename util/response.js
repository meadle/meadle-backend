
/** util/response.js
    handles sending standardized API codes back to the client
*/

var logger = require('log4js').getLogger()

exports.sendOk = function(res, body) {
  res.status(200).send(body)
}

exports.sendCreated = function(res, body) {
  res.status(201).send(body)
}

exports.sendAccepted = function(res, body) {
  res.status(202).send(body)
}

exports.sendBadRequest = function(res, message)) {
  var o = {
    'error': 400,
    'message': message
  }
  res.status(400).send(o)
}

exports.sendUnauthorized = function(res) {
  var o = {
    'error': 401,
    'message': 'Unauthorized'
  }
  res.status(401).send(o)
}

exports.sendForbidden = function(res, message) {
  var o = {
    'error': 403,
    'message': message
  }
  res.status(403).send(o)
}

exports.sendNotFound = function(res, message) {
  var o = {
    'error': 404,
    'message': message
  }
  res.status(404).send(o)
}

exports.sendInternal = function(res) {
  var o = {
    'error': 500,
    'message': 'Internal server error'
  }
  res.status(500).send(o)
}
