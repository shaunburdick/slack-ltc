var Restaurant = require('../lib/restaurant.js');

describe ('Restaurant', function() {
  it ('should hash a restaurant name', function() {
    expect(new Restaurant('Fuzzy Bunny\s').hash).toEqual('fuzzybunnys');
    expect(new Restaurant('Taco Bell').hash).toEqual('tacobell');
    expect(new Restaurant('Chipper\s #1 Damp Bread').hash).toEqual('chippers1dampbread');
    expect(new Restaurant('Barfy\'s Old Milk').hash).toEqual('barfysoldmilk');
  });
});