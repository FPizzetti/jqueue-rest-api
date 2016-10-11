'use strict';

var jqueueMiddleware = require('../middlewares/jqueue.middleware');
var queueMiddleware = require('../middlewares/queue.middleware');
var queueController = require('../controllers/queue.controller');
var messageController = require('../controllers/message.controller');
var databaseController = require('../controllers/database.controller');

module.exports = function (server) {

    server.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });

    server.get('/databases', databaseController.list);
    server.get('/databases/:db', [jqueueMiddleware, databaseController.getByName]);

    server.get('/databases/:db/queues', [jqueueMiddleware, queueController.list]);
    server.get('/databases/:db/queues/:queue', [jqueueMiddleware, queueMiddleware, queueController.getByName]);
    server.put('/databases/:db/queues/:queue', [jqueueMiddleware, queueController.deleteByName, queueController.create]);
    server.del('/databases/:db/queues/:queue', [jqueueMiddleware, queueController.deleteByName]);

    server.get('/databases/:db/queues/:queue/messages', [jqueueMiddleware, queueMiddleware, messageController.listByQueue]);
    server.post('/databases/:db/queues/:queue/messages', [jqueueMiddleware, queueMiddleware, messageController.enqueue]);
    server.get('/databases/:db/queues/:queue/messages/:message_id', [jqueueMiddleware, queueMiddleware, messageController.getById]);
    server.del('/databases/:db/queues/:queue/messages/:message_id', [jqueueMiddleware, queueMiddleware, messageController.deleteMessage]);
    server.patch('/databases/:db/queues/:queue/messages/:message_id', [jqueueMiddleware, queueMiddleware, messageController.update]);

    //massive update
    server.patch('/databases/:db/queues/:queue/messages', [jqueueMiddleware, queueMiddleware, messageController.massiveUpdate]);
    //massive delete
    server.del('/databases/:db/queues/:queue/messages', [jqueueMiddleware, queueMiddleware, messageController.massiveDelete]);
};