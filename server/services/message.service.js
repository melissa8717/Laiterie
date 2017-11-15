/**
 * Created by Wbat on 04/06/2017.
 */
var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.answer = answer;
service.getConversation = getConversation;
service.getUnreadMsg = getUnreadMsg;
service.getAllHome = getAllHome;

module.exports = service;


function getUnreadMsg(idUser) {
    var deferred = Q.defer();
    db.query('SELECT * from unread_msg where destinataire = ? ', [idUser], function (error, msg, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(conversation);
        deferred.resolve(msg);
    });
    return deferred.promise;
}

function getConversation(idMessage) {
    var deferred = Q.defer();
    db.query('SELECT * from commentaire left join users on users.id = commentaire.id_user where id_message = ? ', [idMessage], function (error, conversation, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(conversation);
        deferred.resolve(conversation);
    });
    return deferred.promise;
}

function answer(answer) {
    var deferred = Q.defer();
    db.query('INSERT INTO commentaire ( id_message, date_com, contenu, id_user) VALUES (? , ? , ? , ?)',
        [answer.id_message, answer.date_com, answer.contenu, answer.id_user],
        function (error, conversation, fields) {
            if (error) {
                console.log(error.name + ': ' + error.message)
                deferred.reject(error.name + ': ' + error.message);
            }

            db.query('update message SET traite =  1 ,  date_creation = ? where id_message = ?',
                [new Date(), answer.id_message],
                function (error, data, fields) {
                    if (error) {
                        console.log(error.name + ': ' + error.message)
                        deferred.reject(error.name + ': ' + error.message);
                    }
                });


            deferred.resolve();
        });
    return deferred.promise;
}


function getAll(idUser) {
    var deferred = Q.defer();
    db.query('SELECT users.username, users.firstname, users.lastname, users.id , `id_message`,`titre`,`date_creation`,`contenu`, destinataire, id_chantier, traite \
    FROM message\
    JOIN users on users.id = message.id_user\
    WHERE message.destinataire = ? OR message.id_user =?\
    ORDER BY message.date_creation DESC ', [idUser, idUser], function (error, messages, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(messages);
        deferred.resolve(messages);
    });
    return deferred.promise;
}

function getAllHome(idUser) {
    var deferred = Q.defer();
    db.query('SELECT users.username, users.firstname, users.lastname, users.id , `id_message`,`titre`,`date_creation`,`contenu`, destinataire, id_chantier, traite \
    FROM message\
    JOIN users on users.id = message.id_user\
    WHERE message.destinataire = ? OR message.id_user =?\
    ORDER BY message.date_creation DESC LIMIT 10', [idUser, idUser], function (error, messages, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(messages);
        deferred.resolve(messages);
    });
    return deferred.promise;
}

function getById(_id) {

    var deferred = Q.defer();
    var sql = "SELECT users.username, users.firstname, users.lastname, users.id , `id_message`,`titre`,`date_creation`,`contenu`, destinataire, id_chantier, traite " +
        "FROM message " +
        "JOIN users on users.id = message.id_user\
        WHERE message.id_message = ?";
    var inserts = [+_id];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, message, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(message);
    });
    return deferred.promise;
}

function create(messageParam) {
    //console.log(messageParam);
    var deferred = Q.defer();
    db.query("INSERT INTO message (titre, date_creation, contenu, id_user, destinataire, id_chantier) VALUES (? , ? , ? , ?, ?, ?)",
        [messageParam.titre, new Date(messageParam.date_creation), messageParam.message, messageParam.from, messageParam.to, messageParam.chantier],
        function (error, results, fields) {

            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                //console.log(error.name + ': ' + error.message);
            }
            //console.log(messageParam );
            deferred.resolve();
        });
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    db.query("DELETE FROM message WHERE id_message = ? ", [_id], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }

        deferred.resolve();
    });

    return deferred.promise;
}
