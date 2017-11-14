var Q = require('q');

var db = require('../db.js').get();


var service = {};

service.getCACES = getCACES;
service.createAdresse = createAdresse;
service.getAdresseByContact = getAdresseByContact;
service.updateContactAdresse = updateContactAdresse;
service.deleteAdresseByContact = deleteAdresseByContact;

module.exports = service;

function getCACES() {
    var deferred = Q.defer();
    db.query('SELECT * FROM caces', function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function createAdresse(adresse) {
    var deferred = Q.defer();

    var params = [
        adresse.id_contact,
        adresse.id_chantier,
        adresse.adresse,
        adresse.complement_adr,
        adresse.code_postal,
        adresse.ville,
        adresse.pays,
        adresse.type_adr
    ];

    if(!adresse.adresse || !adresse.ville)
        deferred.resolve();
    else {
        db.query("INSERT INTO adresse VALUES (NULL, ? , ? , ? , ? , ? , ? , ? , ?)", params, function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function getAdresseByContact(id_contact) {
    var deferred = Q.defer();
    db.query('SELECT * FROM adresse WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function updateContactAdresse(adresse){
    var deferred = Q.defer();

    if((!adresse.adresse || adresse.adresse == "") &&
       (!adresse.complement_adr || adresse.complement_adr == "") &&
       (!adresse.code_postal || adresse.code_postal == "") &&
       (!adresse.ville || adresse.ville == "") &&
       (!adresse.pays || adresse.pays == "")){
        db.query('DELETE FROM adresse WHERE id_contact = ?', [adresse.id_contact], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': ' + error.message);

            deferred.resolve();
        });
    } else {
        db.query("SELECT * FROM adresse WHERE id_contact = ?", [adresse.id_contact], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update adresse (1) | '+ error.message);

            var params = [
                adresse.id_contact,
                adresse.id_chantier,
                adresse.adresse,
                adresse.complement_adr,
                adresse.code_postal,
                adresse.ville,
                adresse.pays,
                adresse.type_adr,
                adresse.id_contact
            ];

            if (results.length > 0) {
                params.shift();
                params.shift();
                db.query( "UPDATE adresse SET adresse = ?, complement_adr = ?, code_postal = ?, ville = ?, pays = ?, type_adr = ? WHERE id_contact = ?", params, function (error, results, fields) {
                    if (error) deferred.reject('MySql ERROR trying to update adresse (2) | '+ error.message);

                    deferred.resolve();
                });
            } else {
                params.pop();
                params[params.length-1] = "defaut";
                db.query("INSERT INTO adresse VALUES (NULL, ? , ? , ? , ? , ? , ? , ? , ?)", params, function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }
                    deferred.resolve();
                });
            }
        });
    }

    return deferred.promise;
}

function deleteAdresseByContact(id_contact) {
    var deferred = Q.defer();
    db.query('DELETE FROM adresse WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve();
    });
    return deferred.promise;
}
