'use strict';

module.exports = function (query) {
    var wheres = [];
    var whereParams = [];

    if (query.status) {
        addWhere(wheres, whereParams, 'status', '=', query.status);
    }

    if (query.created_at_start) {
        addWhere(wheres, whereParams, 'created_at', '>=', query.created_at_start);
    }

    if (query.created_at_end) {
        addWhere(wheres, whereParams, 'created_at', '<=', query.created_at_end);
    }

    if (query.modified_at_start) {
        addWhere(wheres, whereParams, 'modified_at', '>=', query.modified_at_start);
    }

    if (query.modified_at_end) {
        addWhere(wheres, whereParams, 'modified_at', '<=', query.modified_at_end);
    }

    return {query: assembleSQL(wheres), whereParams: whereParams};
};

function addWhere(wheres, whereParams, field, operator, value) {
    wheres = wheres || [];
    whereParams = whereParams || [];
    whereParams.push(value);
    wheres.push(field + ' ' + operator + ' ?');
}

function assembleSQL(wheres) {
    var sql = 'SELECT * FROM ??';
    if (wheres && wheres.length) {
        sql += ' WHERE ' + wheres.join(' AND ');
    }
    return sql;
}