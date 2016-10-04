'use strict';
var restify = require('restify'),
    routes = require('./config/routes.config');

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());

routes.createRoutes();

server.listen(6000, function () {
    console.log('jqueue-rest-api listening at port %s', 6000);
});