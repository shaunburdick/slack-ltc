var Restaurant = require('../lib/restaurant.js');

describe ('Restaurant', function() {
  if ('should hash a restaurant name', function() {
    expect(new Restaurant('Fuzzy Bunny\s').hash).toEqual('fuzzybunnys');
  });
});