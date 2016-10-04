'use strict';

var queueDao = require('../daos/queue.dao');
var log = require('../services/log.service');

function list(req, res) {

    log.trace('listing queues');

    res.send(200, {'test': 'test'});
}

module.exports = {
    list: list
}