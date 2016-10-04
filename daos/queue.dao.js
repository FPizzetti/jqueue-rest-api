'use strict';

function list(cb, connection) {
    var queueList = [];
    connection.query('SHOW TABLES', function (error, rows, fields) {
        for (var ix in rows) {
            queueList.push(Object.keys(rows[ix])[0]);
        }
        callBack(cb, error, queueList);
    });
}

module.exports = {
    list: list
};