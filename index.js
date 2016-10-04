'use strict';
var restify = require('restify'),
    routes = require('./config/routes.config'),
    env = require('./config/env.config');

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());

routes(server);

server.listen(env.port, function () {
    console.log('jqueue-rest-api listening at port %s', env.port);
});