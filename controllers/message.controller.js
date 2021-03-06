'use strict';

var log = require('../services/log.service');
var messageDao = require('../daos/message.dao');
var filterService = require('../services/filter.service');

var dateFormat = require('dateformat');

function update(req, res) {

    if (!req.body.status || (req.body.status != 'buried' && req.body.status != 'ready')) {
        return res.send(400, {message: 'body should have status with \'buried\' or \'ready\' values'});
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

function massiveUpdate(req, res) {
    if (!req.body.status || (req.body.status != 'buried' && req.body.status != 'ready')) {
        return res.send(400, {message: 'body should have status with \'buried\' or \'ready\' values'});
    }

    if (req.body.date_time) {
        var date = new Date(req.body.date_time);
        if (isNaN(date.getTime())) {
            return res.send(400, {message: 'invalid date_time'});
        } else {
            req.body.date_time = dateFormat(date, "yyyy-m-dd HH:mm:ss");
        }
    }

    var sql = filterService.assembleUpdate(req.query, req.body);
    sql.whereParams.unshift(req.params.queue);

    messageDao.massiveUpdate(function (err) {
        if (!err) {
            res.send(204);
        } else {
            res.send(500);
        }
    }, req.dataSource, sql);
}

function massiveDelete(req, res) {

    var sql = filterService.assembleDelete(req.query, req.body);
    sql.whereParams.unshift(req.params.queue);

    messageDao.massiveDelete(function (err) {
        if (!err) {
            res.send(200);
        } else {
            res.send(500);
        }
    }, req.dataSource, sql);
}


function listByQueue(req, res) {

    var sql = filterService.assembleSelect(req.query);
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

function deleteMessage(req, res) {

    var queueName = req.queue.getName();

    if (req.params && req.params.message_id) {
        var id = req.params.message_id;

        messageDao.deleteQueue(function (err) {
            if (!err) {
                res.send(200);
            } else {
                if (err.message.match(/ER_BAD_TABLE_ERROR/)) {
                    res.send(200);
                } else {
                    log.error('error deleting message', err);
                    res.send(500, err);
                }
            }
        }, req.dataSource, queueName, id);

    } else {
        res.send(400, {message: 'missing messageId'})
    }

}

function getById(req, res) {

    var queueName = req.queue.getName();

    if (req.params && req.params.message_id) {
        var id = req.params.message_id;

        messageDao.getById(function (err, result) {
            if (!err) {
                if (result) {
                    res.send(200, result);
                } else {
                    res.send(404, {message: 'message ' + id + ' not found'});
                }
            } else {
                res.send(500, err);
            }
        }, req.dataSource, queueName, id);

    } else {
        res.send(400, {message: 'missing messageId'})
    }
}

module.exports = {
    getById: getById,
    deleteMessage: deleteMessage,
    listByQueue: listByQueue,
    enqueue: enqueue,
    update: update,
    massiveUpdate: massiveUpdate,
    massiveDelete: massiveDelete
};