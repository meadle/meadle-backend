
/** Generates a random Id of a given length */
module.exports = function(n) {
  var ida = []
  for (var i = 0; i < n; i++) {
    ida[i] = Math.floor(Math.random()*9)
  }
  return ida.join("")
}
