'use strict';

var log = require('../services/log.service');
var messageDao = require('../daos/message.dao');

function listByQueue(req, res) {

    var params = req.params;

    log.trace('listing messages for queue:', params.queue);

    messageDao.listByQueue(function (err, messageList) {
        if (!err) {
            res.send(200, messageList);
        } else {
            res.send(500);
        }
    }, req.dataSource, params);
}

module.exports = {
    listByQueue: listByQueue
}