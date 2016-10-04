'use strict';

function listByQueue(cb, connection, sql) {
    var messageList = [];
    console.log('sql', sql);
    connection.query(sql, function (error, rows, fields) {
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


module.exports = {
    listByQueue: listByQueue
};