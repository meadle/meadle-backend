
/** Filters a user from the database by removing the fields that we don't want returned the client.
  * I'm not sure if this will ever be called but i'm including it. */
exports.filter = function(user) {

  var nUser = {};
  nUser.userId = user.userId;
  nUser.lat = user.lat;
  nUser.lng = user.lng;

  return nUser;

}

/** Validates that a given object is of the type user object */
exports.validate = function(user) {

  if (!user.userId) {
    return false;
  }
  if (!user.lat) {
    return false;
  }
  if (!user.lng) {
    return false;
  }

  return true;

}