'use strict';

var log = require('../services/log.service');
var messageDao = require('../daos/message.dao');
var filterService = require('../services/filter.service');

function update(req, res) {

    if (!req.body.status || (req.body.status != 'buried' && req.body.status != 'ready')) {
        return res.send(400, {error: 'body should have status with \'buried\' or \'ready\' values'});
    }

    var message = {
        id: req.params.message_id,
        status: req.body.status,
        queue: req.params.queue
    };

    messageDao.update(function (err) {
        if (!err) {
            res.send(204);
        } else {
            res.send(500);
        }
    }, req.dataSource, message);
}

function listByQueue(req, res) {

    var sql = filterService(req.query, req.params.queue);
    sql.whereParams.unshift(req.params.queue);

    log.trace('listing messages for queue:', req.params.queue);
    messageDao.listByQueue(function (err, messageList) {
        if (!err) {
            res.send(200, messageList);
        } else {
            res.send(500);
        }
    }, req.dataSource, sql);
}


function enqueue(req, res) {

    if (req.body && req.body.data) {
        var data = req.body.data;

        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }

        var delay = req.body.delay;
        var priority = req.body.priority;

        if (delay && isNaN(delay)) {
            return res.send(400, {message: 'invalid delay'});
        }
        if (delay) {
            delay = parseInt(delay);
        } else {
            delay = 0;
        }
        if (priority && isNaN(priority)) {
            return res.send(400, {message: 'invalid priority'});
        }
        if (priority) {
            priority = parseInt(priority);
        } else {
            priority = 0;
        }

        req.queue.put(data, delay, priority, function (err, id) {
            if (err) {
                res.send(500, err);
            } else {
                res.send(201, {id: id});
            }
        });
    } else {
        res.send(400, {message: 'missing data'});
    }

}

module.exports = {
    listByQueue: listByQueue,
    enqueue: enqueue,
    update: update
};