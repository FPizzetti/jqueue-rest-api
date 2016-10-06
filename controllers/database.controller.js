'use strict';

var config = require('../config/env.config');

function list(req, res) {
    var databases = [];
    for (var i in config.databases) {
        if (config.databases.hasOwnProperty(i)) {
            var database = config.databases[i];
            var cloned = Object.assign({configName: i}, database);
            delete cloned.password;
            databases.push(cloned);
        }
    }
    res.send(200, databases);
}

function getByName(req, res) {
    var database = config.databases[req.params.db];
    if (!database) {
        res.send(404, {message: 'database not found'});
    } else {
        var cloned = Object.assign({configName: req.params.db}, database);
        delete cloned.password;
        res.send(200, cloned);
    }
}

module.exports = {
    list: list,
    getByName: getByName
};