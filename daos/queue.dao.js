'use strict';

function list(cb, connection) {
    var queueList = [];
    connection.query('SHOW TABLES', function (error, rows) {
        if (rows.length) {
            var property = Object.keys(rows[0])[0];
            for (var ix in rows) {
                if (rows.hasOwnProperty(ix)) {
                    queueList.push(rows[ix][property]);
                }
            }
        }
        cb(error, queueList);
    });
}

function queueTableInfo(cb, connection, queue) {
    connection.query('SELECT * FROM information_schema.TABLES WHERE TABLE_NAME = ?',
        [queue.getName()], function (error, rows) {
            var result = null;
            if (rows.length) {
                result = rows[0];
            }
            cb(error, result);
        });
}

function dropQueue(cb, connection, queue) {
    connection.query('DROP TABLE ??',
        [queue], function (error, rows) {
            cb(error, rows);
        });
}

module.exports = {
    list: list,
    queueTableInfo: queueTableInfo,
    dropQueue: dropQueue
};