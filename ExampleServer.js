var logger = require('tracer').console();

var express = require('express');
var bodyParser = require('body-parser');
var mustacheExpress = require('mustache-express');

var http = require('http');
var path = require('path');

var globals = require("./globals");

function UIServer(){
	var us = this;

	us.express_server = express();

    us.express_server.disable('etag');//Prevents 304s
    us.express_server.engine('mustache', mustacheExpress());
    us.express_server.set('views', path.join(__dirname, 'views'));
    us.express_server.set('view engine', 'mustache');

    us.express_server.use(bodyParser());
    us.express_server.use(express.static(path.join(__dirname, 'public')));
    us.express_server.disable('etag');//Prevents 304s

    us.express_server.get('/forms/:name', function(req, res) {	
		globals.minoval.get_endpoint_rule(req.params.name, function(rule) {
			logger.log(req.params.name, JSON.stringify(rule, null, 4))
			var params = {
				rule: JSON.stringify(rule)
			}
			logger.log(JSON.stringify(rule));
			logger.log(params);
			res.render('form.mustache', params);
		});
    });

	us.express_server.post('/endpoint/:name', function(req, res) {
		logger.log(req.params);
		globals.minoval.validate(req.params.name, req.body, function(validator) {
			var error = validator.end();
			logger.log(error);
			res.json(error);
		});
	});
}

module.exports = UIServer;