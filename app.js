var config = require('./config'),
  VError = require('verror'),
  Command = require('./lib/command'),
  Slack = require('node-slack'),
  app = require('express')(),
  app.use(require('body-parser').json());

