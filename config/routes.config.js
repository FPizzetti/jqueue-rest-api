'use strict';

// var dbMiddleware = require('./middlewares/db.middleware');
var queueController = require('../controllers/queue.controller');
// var messagesController = require('./controllers/message.controller');

module.exports = function (server) {

    // server.use(dbMiddleware.validate);

    server.get('/databases/:db/queues', queueController.list);
    // server.get('/databases/:db/queues/:queue', queueController.getByName);
    // server.put('/databases/:db/queues/:queue', queueController.update);
    // server.delete('/databases/:db/queues/:queue', queueController.remove);
    // server.get('/databases/:db/queues/:queue/messages', messagesController.listByQueue);
    // server.post('/databases/:db/queues/:queue/messages', messagesController.enqueue);
    // server.delete('/databases/:db/queues/:queue/messages/:message_id', messagesController.remove);
    // server.patch('/databases/:db/queues/:queue/messages/:message_id', messagesController.update);
};