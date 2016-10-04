'use strict';

function listByQueue(cb, connection, params) {
    var messageList = [];

    var sql = 'SELECT * FROM ??';
    var sqlParams = [params.queue];

    //do filters

    connection.query(sql, sqlParams, function (error, rows, fields) {
        if (rows.length) {
            for (var ix in rows) {
                messageList.push(rows[ix]);
            }
        }
        cb(error, messageList);
    });
}


module.exports = {
    listByQueue: listByQueue
};