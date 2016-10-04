'use strict';

module.exports = function (query, queue) {
    var wheres = [];

    if (query.status) {
        addWhere(wheres, 'status', '=', query.status);
    }

    if (query.created_at_start) {
        addWhere(wheres, 'created_at', '>=', query.created_at_start);
    }

    if (query.created_at_end) {
        addWhere(wheres, 'created_at', '<=', query.created_at_end);
    }

    if (query.modified_at_start) {
        addWhere(wheres, 'modified_at', '>=', query.modified_at_start);
    }

    if (query.modified_at_end) {
        addWhere(wheres, 'modified_at', '<=', query.modified_at_end);
    }

    return assembleSQL(queue, wheres);
};

function addWhere(wheres, field, operator, value) {
    wheres = wheres || [];
    if (typeof value === 'string') {
        value = "'" + value + "'";
    }
    wheres.push(field + ' ' + operator + ' ' + value);
}

function assembleSQL(table, wheres) {
    var sql = 'SELECT * FROM ' + table;
    if (wheres && wheres.length) {
        sql += ' WHERE ' + wheres.join(' AND ');
    }
    return sql;
}