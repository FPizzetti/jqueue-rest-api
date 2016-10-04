'use strict';

function listByQueue(cb, connection, sql) {
    var messageList = [];
    console.log('sql', sql);

    connection.query(sql.query, sql.whereParams, function (error, rows, fields) {
        if (!error) {

            if (rows.length) {
                for (var ix in rows) {
                    messageList.push(rows[ix]);
                }
            }
        }
        else {
            console.log('err', error);
        }
        cb(error, messageList);
    });
}

function deleteQueue(cb, connection, queue, id) {
    connection.query('DELETE FROM ?? WHERE id = ?', [queue, id], function (error) {
        cb(error);
    });
}

module.exports = {
    deleteQueue: deleteQueue,
    listByQueue: listByQueue
};