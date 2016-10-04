'use strict';

var Jqueue = require('jqueue');
var mysql = require('mysql');
var databases = require('../config/env.config').databases;
var jqueueBuffer = {};
var jqueueBufferSize = 10;

module.exports = function (req, res, next) {

    if (req.params && req.params.db) {
        var dbName = req.params.db;
        var jqueue = jqueueBuffer[dbName];
        if (jqueue) {
            req.jqueue = jqueue.object;
            req.dataSource = jqueue.dataSource;
            next();
        } else {
            var database = databases[dbName];
            if (database) {
                var dataSource = mysql.createPool(database);
                jqueue = new Jqueue(dataSource);
                var bufferKeys = Object.keys(jqueueBuffer);
                if (bufferKeys.length >= jqueueBufferSize) {
                    delete jqueueBuffer[bufferKeys[0]];
                }
                jqueueBuffer[dbName] = {object: jqueue, dataSource: dataSource};
                req.jqueue = jqueue;
                req.dataSource = dataSource;
                next();
            } else {
                res.send(404, {message: 'database ' + dbName + ' not found'});
            }
        }
    } else {
        res.send(400, {message: 'missing database'});
    }

};