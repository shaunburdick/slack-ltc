var config = require('./config'),
  winston = require('winston'),
  VError = require('verror'),
  Command = require('./lib/command'),
  Slack = require('node-slack')
  PTDB = require('ptdb'),
  app = require('express')(),
  app.use(require('body-parser').json());

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(config.logging.console),
    new (winston.transports.File)(config.logging.file)
  ]
});

logger.info('Starting...');

var db = new PTDB('db/' + config.name, config.settings);

app.post(config.server.path, function(req, res) {
  logger.info('Received request: %j', req);
  res.code(200);
});

var server = app.listen(config.server.port, function() {
  var host = server.address().address
  var port = server.address().port
  logger.info('Started server on http://%s:%s', host, port);
});