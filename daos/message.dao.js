'use strict';

function update(cb, connection, message) {
    connection.query('UPDATE ?? SET status = ? WHERE id = ?', [message.queue, message.status, message.id], function (error) {
        cb(error);
    });
}

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
    update: update,
    deleteQueue: deleteQueue,
    listByQueue: listByQueue
};