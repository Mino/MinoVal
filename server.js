var logger = require('mino-logger');
var express = require('express');
var connect = require('connect');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var mustacheExpress = require('mustache-express');

var MinoDB = require('minodb');
var db_address = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/minodb';
var mino = new MinoDB({
    api: true,
    ui: true,
    db_address: db_address
}, "my_app");

var server = express();
server.set('port', process.env.PORT || 5002);
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');
server.use(errorHandler());
server.use(bodyParser.json());

server.use('/mino/', mino.server());

server.engine('mustache', mustacheExpress());
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'mustache');

server.use(express.static(path.join(__dirname, './public')));
server.use(express.static(path.join(__dirname, './bower_components')));

server.get('/*', function(req, res) {
    res.send("Minoval 404");
});

mino.create_user({
	"username": "my_app",
	"email": "marcus+test@minocloud.com",
	"password": "my_password"
}, function(err, res){

	logger.debug("CREATED USER");

	var MinoVal = require('./minoval');
	var minoval = new MinoVal({
		user: "my_app"
	});

	mino.add_plugin(minoval);

	http.createServer(server).listen(server.get('port'), function() {
	    logger.info('Server started on port ' + server.get('port'));
	});
});