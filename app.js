var config = require('./config'),
  winston = require('winston'),
  VError = require('verror'),
  Command = require('./lib/command'),
  Slack = require('node-slack'),
  slackers = {},
  PTDB = require('ptdb'),
  app = require('express')();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(config.logging.console),
    new (winston.transports.File)(config.logging.file)
  ]
});

logger.info('Starting...');

logger.info('Setting up slackers...');
for (var slacker in config.slack) {
  slackers[slacker] = new Slack(config.slack[slacker].domain, config.slack[slacker].token);
}

var db = new PTDB('db/' + config.name, config.settings);

app.use(require('body-parser').urlencoded({
  extended: true
}));

app.post(config.server.path, function(req, res) {
  logger.info('Received request:', req.body);
  res.status(200).end();
});

var server = app.listen(config.server.port, function() {
  var host = server.address().address
  var port = server.address().port
  logger.info('Started server on http://%s:%s', host, port);
});
