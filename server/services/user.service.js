var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;

service.getAllUser = getAllUser;
service.updateUser = updateUser;
service.getCount = getCount;
service.getCurrentnb = getCurrentnb;

service.createdroit = createdroit;
service.modifdroit = modifdroit;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.query("SELECT * FROM users WHERE username=?", [username], function (error, results, fields) {
        if (error) {
            console.log(error.message);
            deferred.reject('MySql ERROR trying to authenticate user | ' + error.message);
        }

        var user = results[0];

        if (user && bcrypt.compareSync(password, user.password)) {
            // authentication successful
            deferred.resolve({
                _id: user.id,
                username: user.username,
                statutName: user.statut,
                firstName: user.firstname,
                lastName: user.lastname,
                token: jwt.sign({sub: user.id}, " ")
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    db.query('SELECT * FROM users', function (error, users, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        users = _.map(users, function (user) {
            return _.omit(user, 'password');
        });
        deferred.resolve(users);
    });
    return deferred.promise;
}

function getById(_id) {

    var deferred = Q.defer();
    var sql = "SELECT * FROM users WHERE id = ?";
    var inserts = [_id];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, user, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        if (user.username !== undefined) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'password'));
        }
        else {
            // user not found
            deferred.resolve();
        }

    });
    return deferred.promise;

}

function create(userParam) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM users WHERE username = ?";
    var inserts = [userParam.username];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, users, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        if (users.length === 0) {
            createUser();
        } else {
            // username already exists
            deferred.reject('Username "' + userParam.username + '" is already taken');
        }
    });

    function createUser() {
        // add hashed password to user object
        userParam.password = bcrypt.hashSync(userParam.password, 10);

        db.query("INSERT INTO users (username, password, firstname, lastname) VALUES (? , ? , ? , ?)", [userParam.username, userParam.password, userParam.firstName, userParam.lastName], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': ' + error.message);
            deferred.resolve();
        });

    }

    return deferred.promise;
}


function _delete(_id) {
    var deferred = Q.defer();
    db.query("DELETE FROM users WHERE id = ? ", [_id], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve();
    });

    return deferred.promise;
}

function getAllUser() {
    var deferred = Q.defer();
    db.query('SELECT id,statut,username,firstname,lastname from users', function (error, util, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(util);
    });
    return deferred.promise;
}

function updateUser(id, user_param) {
    var deferred = Q.defer();
    //console.log(user_param);


    user_param.password = bcrypt.hashSync(user_param.password, 10);
    // console.log(sql);

    db.query("UPDATE users SET statut=?,password=?,username=?,firstname=?,lastname=? WHERE id = ? ",
        [user_param.statut, user_param.password, user_param.username, user_param.firstname, user_param.lastname, id],

        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

        });
    return deferred.promise;
}

function getCount() {
    var deferred = Q.defer();
    db.query('SELECT COUNT( id ) AS nb  from users', function (error, util, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(util);
    });
    return deferred.promise;
}

function getCurrentnb(_id) {
    var deferred = Q.defer();
    var sql = "SELECT  * FROM usersdroits WHERE id = ? ";
    var inserts = [_id];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function createdroit(userParam, id) {
    //console.log("test1");
    var Params;
    var deferred = Q.defer();
    //console.log( userParam);
    Params = [
        userParam.accescontact,
        userParam.supcontact,
        userParam.ajoutcontact,
        userParam.modifcontact,
        userParam.validcontact,
        userParam.accesproa,
        userParam.supproa,
        userParam.ajoutproa,
        userParam.modifproa,
        userParam.validproa,
        userParam.accesprov,
        userParam.supprov,
        userParam.ajoutprov,
        userParam.modifprov,
        userParam.validprov,
        userParam.accescom,
        userParam.supcom,
        userParam.ajoutcom,
        userParam.modifcom,
        userParam.validcom,
        userParam.accescha,
        userParam.supcha,
        userParam.ajoutcha,
        userParam.modifcha,
        userParam.validcha,
        userParam.accesdev,
        userParam.supdev,
        userParam.ajoutdev,
        userParam.modifdev,
        userParam.validdev,
        userParam.accesfact,
        userParam.supfact,
        userParam.ajoutfact,
        userParam.modiffact,
        userParam.validfact,
        userParam.accesfour,
        userParam.supfour,
        userParam.ajoutfour,
        userParam.modiffour,
        userParam.validfour,
        userParam.accesfrais,
        userParam.supfrais,
        userParam.ajoutfrais,
        userParam.modiffrais,
        userParam.validfrais,
        userParam.accesbg,
        userParam.supbg,
        userParam.ajoutbg,
        userParam.modifbg,
        userParam.validbg,
        userParam.accespb,
        userParam.suppb,
        userParam.ajoutpb,
        userParam.modifpb,
        userParam.validpb,
        userParam.accespc,
        userParam.suppc,
        userParam.ajoutpc,
        userParam.modifpc,
        userParam.validpc,
        userParam.accesparam,
        userParam.supparam,
        userParam.ajoutparam,
        userParam.modifparam,
        userParam.validparam,
        userParam.accesmes,
        userParam.supmes,
        userParam.ajoutmes,
        userParam.modifmes,
        userParam.validmes,
        id
    ];
    var query = "INSERT INTO usersdroits (accescontact,supcontact,ajoutcontact,modifcontact,validcontact,accesproa,supproa,ajoutproa,modifproa,validproa,accesprov,supprov,ajoutprov,modifprov,validprov, " +
        "accescom,supcom,ajoutcom,modifcom,validcom,accescha,supcha,ajoutcha,modifcha,validcha,accesdev,supdev,ajoutdev,modifdev,validdev,accesfact,supfact,ajoutfact,modiffact,validfact, " +
        "accesfour,supfour,ajoutfour,modiffour,validfour,accesfrais,supfrais,ajoutfrais,modiffrais,validfrais,accesbg,supbg,ajoutbg,modifbg,validbg,accespb,suppb,ajoutpb,modifpb,validpb,accespc,suppc, " +
        "ajoutpc,modifpc,validpc,accesparam,supparam,ajoutparam,modifparam,validparam,accesmes,supmes,ajoutmes,modifmes,validmes,id) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    db.query(query, Params, function (error, results, fields) {
        if (error) {
            console.log("error in add service :" + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}


function modifdroit(userParam) {
    var deferred = Q.defer();
    //console.log(userParam.droits);


    db.query("UPDATE usersdroits SET accescontact=?,supcontact=?,ajoutcontact=?,modifcontact=?,validcontact=?,accesproa=?,supproa=?,ajoutproa=?,modifproa=?,validproa=?,accesprov=?,supprov=?,ajoutprov=?,modifprov=?,validprov=?, " +
        "accescom=?,supcom=?,ajoutcom=?,modifcom=?,validcom=?,accescha=?,supcha=?,ajoutcha=?,modifcha=?,validcha=?,accesdev=?,supdev=?,ajoutdev=?,modifdev=?,validdev=?,accesfact=?,supfact=?,ajoutfact=?,modiffact=?,validfact=?, " +
        "accesfour=?,supfour=?,ajoutfour=?,modiffour=?,validfour=?,accesfrais=?,supfrais=?,ajoutfrais=?,modiffrais=?,validfrais=?,accesbg=?,supbg=?,ajoutbg=?,modifbg=?,validbg=?,accespb=?,suppb=?,ajoutpb=?,modifpb=?,validpb=?,accespc=?,suppc=?, " +
        "ajoutpc=?,modifpc=?,validpc=?,accesparam=?,supparam=?,ajoutparam=?,modifparam=?,validparam=?,accesmes=?,supmes=?,ajoutmes=?,modifmes=?,validmes=? WHERE id_droit=?",
        [userParam.droits.accescontact,
            userParam.droits.supcontact,
            userParam.droits.ajoutcontact,
            userParam.droits.modifcontact,
            userParam.droits.validcontact,
            userParam.droits.accesproa,
            userParam.droits.supproa,
            userParam.droits.ajoutproa,
            userParam.droits.modifproa,
            userParam.droits.validproa,
            userParam.droits.accesprov,
            userParam.droits.supprov,
            userParam.droits.ajoutprov,
            userParam.droits.modifprov,
            userParam.droits.validprov,
            userParam.droits.accescom,
            userParam.droits.supcom,
            userParam.droits.ajoutcom,
            userParam.droits.modifcom,
            userParam.droits.validcom,
            userParam.droits.accescha,
            userParam.droits.supcha,
            userParam.droits.ajoutcha,
            userParam.droits.modifcha,
            userParam.droits.validcha,
            userParam.droits.accesdev,
            userParam.droits.supdev,
            userParam.droits.ajoutdev,
            userParam.droits.modifdev,
            userParam.droits.validdev,
            userParam.droits.accesfact,
            userParam.droits.supfact,
            userParam.droits.ajoutfact,
            userParam.droits.modiffact,
            userParam.droits.validfact,
            userParam.droits.accesfour,
            userParam.droits.supfour,
            userParam.droits.ajoutfour,
            userParam.droits.modiffour,
            userParam.droits.validfour,
            userParam.droits.accesfrais,
            userParam.droits.supfrais,
            userParam.droits.ajoutfrais,
            userParam.droits.modiffrais,
            userParam.droits.validfrais,
            userParam.droits.accesbg,
            userParam.droits.supbg,
            userParam.droits.ajoutbg,
            userParam.droits.modifbg,
            userParam.droits.validbg,
            userParam.droits.accespb,
            userParam.droits.suppb,
            userParam.droits.ajoutpb,
            userParam.droits.modifpb,
            userParam.droits.validpb,
            userParam.droits.accespc,
            userParam.droits.suppc,
            userParam.droits.ajoutpc,
            userParam.droits.modifpc,
            userParam.droits.validpc,
            userParam.droits.accesparam,
            userParam.droits.supparam,
            userParam.droits.ajoutparam,
            userParam.droits.modifparam,
            userParam.droits.validparam,
            userParam.droits.accesmes,
            userParam.droits.supmes,
            userParam.droits.ajoutmes,
            userParam.droits.modifmes,
            userParam.droits.validmes,
            userParam.droits.id_droit],

        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve()

        });
    return deferred.promise;
}