var Command = require('../lib/command.js');

describe ('Command Parser', function() {
  it ('should throw error on non-string', function() {
    expect(function() { new Command(); }).toThrow();
    expect(function() { new Command(null); }).toThrow();
    expect(function() { new Command([1,2,3,4]); }).toThrow();
  });

  it ('should throw error if no commands are found', function() {
    expect(function() { new Command('foo'); }).toThrow();
  })

  it ('should parse IN commands', function() {
    var res = new Command('in');
    expect(res.cmds).toEqual([
      { cmd: 'IN', args: [] }
    ]);
  });

  it ('should parse AT commands', function() {
    var res = new Command('at >11:45am <1:00pm');
    expect(res.cmds).toEqual([
      { cmd: 'AT', args: [ '>11:45am',  '<1:00pm'] }
    ]);
  });

  it ('should parse TO commands', function() {
    var res = new Command('to Foo');
    expect(res.cmds).toEqual([
      { cmd: 'TO', args: [ 'Foo' ] }
    ]);

    var parse = res.parse('to Foo, Bar');
    expect(parse).toEqual([
      { cmd: 'TO', args: [ 'Foo', 'Bar' ] }
    ]);
  });

  it ('should parse NO commands', function() {
    var res = new Command('no ride');
    expect(res.cmds).toEqual([
      { cmd: 'NO', args: [ 'ride' ] }
    ]);
  });

  it ('should parse TAKING commands', function() {
    var res = new Command('taking 3');
    expect(res.cmds).toEqual([
      { cmd: 'TAKING', args: [ '3' ] }
    ]);
  });

  it ('should parse quoted arguments', function() {
    var res = new Command('to Foo, Bar, "Fizz Buzz", "Taco Bell", "Jimmy\'s Cafe"');
    expect(res.cmds).toEqual([
      { cmd: 'TO', args: [ 'Foo', 'Bar', 'Fizz Buzz', 'Taco Bell', 'Jimmy\'s Cafe' ] }
    ]);
  });

  it ('should parse multiple commands', function() {
    var res = new Command('in at >11:45am <1:00pm to Chipotle\'s, Moe\'s, Fudruckers taking 3');
    expect(res.cmds).toEqual([
      { cmd: 'IN', args: [] },
      { cmd: 'AT', args: ['>11:45am', '<1:00pm'] },
      { cmd: 'TO', args: ['Chipotle\'s', 'Moe\'s', 'Fudruckers'] },
      { cmd: 'TAKING', args: ['3'] }
    ]);
  });

  it ('should traverse command tree', function() {
    var res = new Command('in at >11:45am <1:00pm to Chipotle\'s, Moe\'s, Fudruckers taking 3');
    expect(res.current()).toEqual({ cmd: 'IN', args: [] });

    expect(res.next()).toEqual({ cmd: 'AT', args: ['>11:45am', '<1:00pm'] });

    expect(res.prev()).toEqual({ cmd: 'IN', args: [] });

    expect(res.prev).toThrow();

    res.next();res.next();

    expect(res.current()).not.toEqual({ cmd: 'IN', args: [] });

    expect(res.reset()).toEqual({ cmd: 'IN', args: [] });
  });
});