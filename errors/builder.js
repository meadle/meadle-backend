
exports.build400 = function(message) {
  return {
    'error': 400,
    'message': message
  }
}

exports.build401 = function() {
  return {
    'error': 401,
    'message': "You are not authorized to view this resource"
  }
}

exports.build403 = function(message) {
  return {
    'error': 403,
    'message': message
  }
}

exports.build404 = function(message) {
  return {
    'error': 404,
    'message': message
  }
}

exports.build500 = function() {
  return {
    'error': 500,
    'message': 'Internal server error'
  }
}
