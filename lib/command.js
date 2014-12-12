/**
 * This module will parse LTC commands
 */

var VError = require('verror');

function Command(raw) {
  this.CMD_IN = 'IN';
  this.CMD_AT = 'AT';
  this.CMD_TO = 'TO';
  this.CMD_NO = 'NO';
  this.CMD_TAKING = 'TAKING';

  this.raw = raw;
  this.cmds = this.parse(raw);
  this.pointer = 0;
}

/**
 * Parse commands into actions.
 * Splits a string of space separated commands and their arguments.
 * @example 'in at >12:00pm' becomes [ ['cmd': 'IN', 'args': []], ['cmd': 'AT', 'args': ['>12:00pm']] ]
 * @param string raw The raw list of commands and params
 * @return array [ [cmd: cmd1, args: [arg1, arg2,...]], ...)
 */
Command.prototype.parse = function(raw) {
  if (typeof raw !== 'string' || raw.length === 0) {
    throw new VError('Invalid or empty string: %s', raw);
  }

  var retVal = [],
      currentCmd = null,
      currentArgs = [],
      splody = raw.match(/["]([^"]+)["]\,?|([^\s]+)\,?/g); // split on space but allow quotes

  for (var i = 0; i < splody.length; i++) {
    splody[i] = splody[i].replace(/^["']+|["'\,]+$/g, ''); // remove any quotes, commas
    if (splody.length > 0) {
      switch (splody[i].toUpperCase()) {
        case this.CMD_IN:
        case this.CMD_AT:
        case this.CMD_TO:
        case this.CMD_NO:
        case this.CMD_TAKING:
          if (currentCmd !== null) {
            retVal.push({
              cmd: currentCmd,
              args: currentArgs
            });
          }

          currentCmd = splody[i].toUpperCase();
          currentArgs = [];
          break;
        default:
          currentArgs.push(splody[i]);
      }
    }
  }

  // Check to be sure we got at least one command
  if (currentCmd === null) {
    throw new VError('No commands found in: %s', raw);
  }

  retVal.push({
    cmd: currentCmd,
    args: currentArgs
  });

  return retVal;
};

/**
 * Get the next command.
 * @return object { cmd: string, args: [] }
 */
Command.prototype.next = function() {
  if (this.pointer + 1 >= this.cmds.length) {
    throw new VError('Array out of bounds!');
  }

  return this.cmds[++this.pointer];
};

/**
 * Get the previous command
 * @return object { cmd: string, args: [] }
 */
Command.prototype.prev = function() {
  if (this.pointer - 1 < 0) {
    throw new VError('Array out of bounds!');
  }

  return this.cmds[--this.pointer];
};

/**
 * Reset to the beginning.
 * @return object { cmd: string, args: [] }
 */
Command.prototype.reset = function() {
  this.pointer = 0;
  return this.cmds[this.pointer];
};

/**
 * Get the current command.
 * @return object { cmd: string, args: [] }
 */
Command.prototype.current = function() {
  return this.cmds[this.pointer];
};

module.exports = Command;