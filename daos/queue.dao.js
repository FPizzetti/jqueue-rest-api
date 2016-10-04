'use strict';

function list(cb, connection) {
    var queueList = [];
    connection.query('SHOW TABLES', function (error, rows, fields) {
        if (rows.length) {
            var property = Object.keys(rows[0])[0];
            for (var ix in rows) {
                queueList.push(rows[ix][property]);
            }
        }
        cb(error, queueList);
    });
}


module.exports = {
    list: list
};