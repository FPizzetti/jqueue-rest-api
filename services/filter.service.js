'use strict';

var log = require('../services/log.service');

function assembleUpdate(query, properties) {

    log.trace('assemble update', query, properties);

    var paramsSet = assembleSets(properties);
    var paramsWhere = assembleWheres(query);

    return {
        query: assembleUpdateSQL(paramsSet.sets, paramsWhere.wheres),
        whereParams: paramsSet.setParams.concat(paramsWhere.whereParams)
    };
}

function assembleDelete(query) {

    log.trace('assemble delete', query);

    var paramsWhere = assembleWheres(query);

    return {
        query: assembleDeleteSQL(paramsWhere.wheres),
        whereParams: paramsWhere.whereParams
    };
}

function assembleSelect(query) {
    var params = assembleWheres(query);
    return {query: assembleSelectSQL(params.wheres), whereParams: params.whereParams};
}

function assembleSets(properties) {
    var sets = [];
    var setParams = [];

    if (properties.status) {
        addSet(sets, setParams, 'status', properties.status);
    }

    if (properties.date_time) {
        addSet(sets, setParams, 'date_time', properties.date_time);
    }
    return {sets: sets, setParams: setParams};
}

function assembleWheres(query) {
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

    if (query.data) {
        addWhere(wheres, whereParams, 'data', ' like ', '%' + query.data + '%');
    }

    if (query.id) {
        addWhere(wheres, whereParams, 'id', ' = ', query.id);
    }

    return {wheres: wheres, whereParams: whereParams};
}

function addWhere(wheres, whereParams, field, operator, value) {
    wheres = wheres || [];
    whereParams = whereParams || [];
    whereParams.push(value);
    wheres.push(field + ' ' + operator + ' ?');
}

function addSet(sets, setParams, field, value) {
    sets = sets || [];
    setParams = setParams || [];
    setParams.push(value);
    sets.push(field + ' = ' + ' ?');
}

function assembleUpdateSQL(sets, wheres) {
    var sql = 'UPDATE ??';
    if (sets && sets.length) {
        sql += ' SET ' + sets.join(' , ');
    }
    if (wheres && wheres.length) {
        sql += ' WHERE ' + wheres.join(' AND ');
    }
    return sql;
}

function assembleDeleteSQL(wheres) {
    var sql = 'DELETE FROM ??';
    if (wheres && wheres.length) {
        sql += ' WHERE ' + wheres.join(' AND ');
    }
    return sql;
}

function assembleSelectSQL(wheres) {
    var sql = 'SELECT * FROM ??';
    if (wheres && wheres.length) {
        sql += ' WHERE ' + wheres.join(' AND ');
    }
    return sql;
}

module.exports = {
    assembleUpdate: assembleUpdate,
    assembleDelete: assembleDelete,
    assembleSelect: assembleSelect
};