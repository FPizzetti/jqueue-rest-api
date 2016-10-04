'use strict';

var queueDao = require('../daos/queue.dao');
var log = require('../services/log.service');
var Jqueue = require('jqueue');

function list(req, res) {

    log.trace('listing queues');

    queueDao.list(function (err, list) {
        if (!err) {
            res.send(200, list);
        } else {
            log.error('error listing queues', err);
            res.send(500);
        }
    }, req.dataSource);


}

function getByName(req, res) {

    queueDao.queueTableInfo(function (err, result) {
        if (!err) {
            if (result) {
                res.send(200, result);
            } else {
                res.send(404, {message: 'queue ' + req.queue.getName() + ' not found'});
            }
        } else {
            log.error('error retrieving queue', err);
            res.send(500);
        }
    }, req.dataSource, req.queue);

}

function create(req, res) {
    if (req.params && req.params.queue) {
        var queueName = req.params.queue;
        var ephemeral = req.body && req.body.ephemeral ? req.body.ephemeral : false;
        var jqueue = new Jqueue(req.dataSource);
        jqueue.use(queueName, false, ephemeral, function (err, rows, fields) {
            if (err) {
                res.send(500, err);
            } else {
                res.send(201);
            }
        });
    }
}

function deleteByName(req, res, next) {

    if (req.params && req.params.queue) {
        queueDao.dropQueue(function (err) {
            if (!err) {
                if (req.method === 'PUT') {
                    next();
                } else {
                    res.send(200);
                }
            } else {
                if (err.message.match(/ER_BAD_TABLE_ERROR/)) {
                    if (req.method === 'PUT') {
                        next();
                    } else {
                        res.send(200);
                    }
                } else {
                    log.error('error dropping queue', err);
                    res.send(500);
                }
            }
        }, req.dataSource, req.params.queue);
    } else {
        res.send(400, {message: 'missing queue'});
    }

}

module.exports = {
    list: list,
    getByName: getByName,
    create: create,
    deleteByName: deleteByName
};