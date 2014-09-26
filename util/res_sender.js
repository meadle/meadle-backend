
exports.sendOK = function(res, body) {
  res.status(200).send(object)
}

exports.sendCreated = function(res, body) {
  res.status(201).send(object)
}

exports.sendAccepted = function(res, body) {
  res.status(202).send(object)
}

exports.sendBadRequest = function(res, message) {
  var obj = { 'error': 400, 'message': message }
  res.status(400).send(obj)
}

exports.sendUnauthorized = function(res) {
  var obj = { 'error': 401, 'message': "You are not authorized to view this resource" }
  res.status(401).send(obj)
}

exports.sendForbidden = function(res, message) {
  var obj = { 'error': 403, 'message': message }
  res.status(403).send(obj)
}

exports.sendNotFound = function(res, message) {
  var obj = { 'error': 404, 'message': message }
  res.status(404).send(obj)
}

exports.sendInternalError = function(res) {
  var obj = { 'error': 500, 'message': 'Internal server error' }
  res.status(500).send(obj)
}
