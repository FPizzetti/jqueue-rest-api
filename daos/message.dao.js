'use strict';

function listByQueue(cb, connection, params) {
    var messageList = [];

    var sql = 'SELECT * FROM ??';
    var sqlParams = [params.queue];

    if (params.status && params.created_at) {
        sql += ' WHERE status = ? AND created_at = ?';
        sqlParams.push(params.status);
        sqlParams.push(params.created_at);
    } else if (params.status) {
        sql += ' WHERE status = ?';
        sqlParams.push(params.status);
    } else {
        sql += 'WHERE created_at = ?';
        sqlParams.push(params.created_at);
    }

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