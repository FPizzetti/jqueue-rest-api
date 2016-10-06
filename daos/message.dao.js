'use strict';

function update(cb, connection, message) {
    connection.query('UPDATE ?? SET status = ? WHERE id = ?', [message.queue, message.status, message.id], function (error) {
        cb(error);
    });
}

function massiveUpdate(cb, connection, sql) {
    console.log('sql', sql);
    connection.query(sql.query, sql.whereParams, function (error) {
        console.log('err', error);
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

function getById(cb, connection, queue, id) {
    connection.query('SELECT * FROM ?? WHERE id = ?', [queue, id], function (error, rows) {
        if (error) {
            cb(error);
        } else {
            var result = null;
            if (rows.length) {
                result = rows[0];
            }
            cb(error, result);
        }
    });
}

module.exports = {
    update: update,
    getById: getById,
    deleteQueue: deleteQueue,
    listByQueue: listByQueue,
    massiveUpdate: massiveUpdate
};