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

/**
 * Format a set of commands by a user to an announcement.
 * @param string username
 * @param object commands
 * @return string
 */
Command.prototype.formatAnnouncement = function(username, commands) {
  var retVal = '@' + username + ' is in',
    commands = commands || this.cmds,
    formatted = {},
    leaving = null,
    returning = null;

  for (var cmd in commands) {
    switch(commands[cmd].cmd) {
      case this.CMD_IN:
        // Nothing to format
        break;

      // TO Cmd
      case this.CMD_TO:
        formatted[this.CMD_TO] = 'for ' + commands[cmd].args.join(', ');
        break;

      // AT Command
      case this.CMD_AT:
        var pieces = '';
        for (var places in commands[cmd].args) {
          if (/^>/.test(commands[cmd].args[places])) {
            leaving = commands[cmd].args[places].replace('>', '');
          } else if (/^</.test(commands[cmd].args[places])) {
            returning = commands[cmd].args[places].replace('<', '');
          }
        }

        if (leaving) {
          pieces = 'leaving after ' + leaving;
        }

        if (returning) {
          if (leaving) {
            pieces += ' and ';
          }
          pieces += 'returning before ' + returning;
        }

        formatted[this.CMD_AT] = pieces;
        break;

      // TAKING command
      case this.CMD_TAKING:
        formatted[this.CMD_TAKING] = 'They can take ' + commands[cmd].args.join(', ') + '.';
        break;

      // NO command
      case this.CMD_NO:
        formatted[this.CMD_NO] = 'No ' + commands[cmd].args.join(', ') + '.';
        break;
    }
  }

  if (formatted.hasOwnProperty(this.CMD_TO)) {
    retVal += ' ' + formatted[this.CMD_TO];
  } else {
    retVal += ' for food';
  }

  if (formatted.hasOwnProperty(this.CMD_AT)) {
    retVal += ' ' + formatted[this.CMD_AT];
  }

  retVal += '.';

  if (formatted.hasOwnProperty(this.CMD_TAKING)) {
    retVal += ' ' + formatted[this.CMD_TAKING];
  }

  if (formatted.hasOwnProperty(this.CMD_NO)) {
    retVal += ' ' + formatted[this.CMD_NO];
  }

  return retVal;
};

module.exports = Command;