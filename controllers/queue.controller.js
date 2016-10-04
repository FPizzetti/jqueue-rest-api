'use strict';

var queueDao = require('../daos/queue.dao');
var log = require('../services/log.service');

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

module.exports = {
    list: list
}