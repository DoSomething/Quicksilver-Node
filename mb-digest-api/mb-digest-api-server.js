var express           = require('express');
var redis             = require('redis');
var bodyParser        = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');
var fs                = require('fs');
var morgan            = require('morgan');
 
var routes = require('./routes/routes');
var mb_config = require(__dirname + '/config/mb_config.json');
var logDirectory = __dirname + '/logs';

// @todo - remove if use of mb_config.json makes more sense
var PORT       = process.env.PORT       || 4744        ;
var REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1' ;
var REDIS_PORT = process.env.REDIS_PORT || 6379        ;

/**
 * Express Setup
 */
var app = express();

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// var accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});

// configure app to use bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Toggle tools and logging based on enviroment setting
if (app.get('env') == 'development') {
  // To output objects for debugging
  // console.log("/ request: " + util.inspect(request, false, null));
  var util = require('util');
  app.use(morgan('dev', {stream: accessLogStream}));
}
else if (app.get('env') == 'production') {
  app.use(morgan('common', {
    skip: function(req, res) { return res.statusCode < 400 },
    stream: accessLogStream
  }));
}

// REGISTER ROUTES
// =============================================================================
// All of routes will be prefixed with /api
app.use('/api', routes);

/**
 * Start server.
 */
var port = process.env.MB_DIGEST_API_PORT || mb_config.default.port;
app.listen(port, function() {
  console.log('Message Broker Logging API server listening on port %d in %s mode.', port, app.settings.env);
});