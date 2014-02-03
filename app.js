
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , nib = require('nib')
  , stylus = require('stylus')
  ;

var mapgen = require('./routes/mapgen.js');

var app = express();

function compile(str, path) {
	return stylus(str)
		.set('filename',path)
		.set('compress',true)
		.use(nib())
		;
}

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('json spaces',0);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
  app.use(stylus.middleware({
  	src: __dirname + '/public',
  	compile: compile
  }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/map/:fuckMelonJS',mapgen.retrieve);
app.get('/map/:seed/:fuckMelonJS', mapgen.retrieve);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
