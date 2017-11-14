var mysql = require('mysql');
var async = require('async');

var PRODUCTION_HOST = 'mysql';
var PRODUCTION_USER = 'root';
var PRODUCTION_PWD = 'root';
var PRODUCTION_DB = 'wbat_alwaysdata';

var TEST_HOST = 'mysql-wbat.alwaysdata.net';
var TEST_USER = 'wbat';
var TEST_PWD = 'WBAT201701';
var TEST_DB = 'wbat_alwaysdata';

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
    pool: null,
    mode: null
};

state.mode = process.env.NODE_ENV === 'production' ? this.MODE_PRODUCTION : this.MODE_TEST;

exports.connect = function () {
    state.pool = mysql.createPool({
        host: state.mode === exports.MODE_PRODUCTION ? PRODUCTION_HOST : TEST_HOST,
        user: state.mode === exports.MODE_PRODUCTION ? PRODUCTION_USER : TEST_USER,
        password: state.mode === exports.MODE_PRODUCTION ? PRODUCTION_PWD : TEST_PWD,
        database: state.mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
    });
};

exports.get = function () {
    return state.pool;
};

exports.fixtures = function (data) {
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    var names = Object.keys(data.tables);
    async.each(names, function (name, cb) {
        async.each(data.tables[name], function (row, cb) {
            var keys = Object.keys(row)
                , values = keys.map(function (key) {
                return "'" + row[key] + "'"
            });

            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
        }, cb)
    }, done)
};

/*exports.drop = function(tables, done) {
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    async.each(tables, function(name, cb) {
        pool.query('DELETE * FROM ' + name, cb)
    }, done)
};*/