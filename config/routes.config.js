'use strict';

var jqueueMiddleware = require('../middlewares/jqueue.middleware');
var queueMiddleware = require('../middlewares/queue.middleware');
var queueController = require('../controllers/queue.controller');
var messageController = require('../controllers/message.controller');

module.exports = function (server) {

    server.use(jqueueMiddleware);

    server.get('/databases/:db/queues', queueController.list);
    server.get('/databases/:db/queues/:queue', [queueMiddleware, queueController.getByName]);
    server.put('/databases/:db/queues/:queue', queueController.create);
    server.del('/databases/:db/queues/:queue', queueController.deleteByName);
    server.get('/databases/:db/queues/:queue/messages', [queueMiddleware, messageController.listByQueue]);
    server.post('/databases/:db/queues/:queue/messages', [queueMiddleware, messageController.enqueue]);
    server.delete('/databases/:db/queues/:queue/messages/:message_id',[queueMiddleware, messagesController.remove]);
    server.patch('/databases/:db/queues/:queue/messages/:message_id', [queueMiddleware, messagesController.update]);
};