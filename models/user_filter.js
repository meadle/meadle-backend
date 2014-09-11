
/** Filters a user by removing the fields that we don't want returned the client.
  * I'm not sure if this will ever be called but i'm including it. */
exports.filter = function(user) {

  var nUser = {};
  nUser.userId = user.userId;
  nUser.lat = user.lat;
  nUser.lng = user.lng;

  return nUser;

}
