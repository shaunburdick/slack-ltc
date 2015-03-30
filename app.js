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
  if (slackers.hasOwnProperty(req.body.team_domain)) {
    var slacker = slackers[req.body.team_domain];
    try {
      var cmd = new Command(req.body.text);
      var announce = cmd.formatAnnouncement(req.body.user_name);
      slacker.send({
        text: announce,
        channel: req.body.channel_name,
        link_names: 1
      });
      res.status(200).send('Updating status to: ' + announce);
    } catch (e) {
      logger.error(e.message);
      res.status(200).send(e.message);
    }
  } else {
    res.status(403).send("Your slack instance is not configured!");
  }
});

var server = app.listen(config.server.port, function() {
  var host = server.address().address
  var port = server.address().port
  logger.info('Started server on http://%s:%s', host, port);
});
