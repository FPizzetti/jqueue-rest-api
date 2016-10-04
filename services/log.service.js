'use strict';
const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
    name: 'jqueue-rest-api'
});