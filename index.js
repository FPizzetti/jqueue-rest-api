'use strict';
var restify = require('restify');

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());

server.listen(6000, function () {
    console.log('jqueue-rest-api listening at port %s', 6000);
});