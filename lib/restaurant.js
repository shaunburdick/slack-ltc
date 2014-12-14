/**
 * This module represents resturants.
 */

var VError = require('verror');

function Restaurant(name) {
  this.name = name;
  this.hash = this.hashName(name);
}

/**
 * Hash a plain text restaurant into a unique hash.
 * This removes any spaces or decoration and lowers the text.
 * @return string hash
 */
Restaurant.prototype.hashName = function(name) {
  if (typeof name !== 'string' || name.length == 0) {
    throw new VError('Invalid or empty string: %s', raw);
  }

  return name.toLowerCase().replace(/[^\w]/g, '');
};

module.exports = Restaurant;