/**
 * Created by Wbat on 17/07/2017.
 */
var Q = require('q');
var mysql = require('mysql');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'wbat2017-secret-hashing-password';

var db = require('../db.js').get();

var service = {};

service.addagence = addagence;
service.getAllAgence = getAllAgence;
service.getAllFili = getAllFili;

service.updateAgence = updateAgence;

service.getAllTVA = getAllTVA;
service.updateTva = updateTva;

service.getAllCat = getAllCat;
service.updateCat = updateCat;
service.addCat = addCat;
service.getAllUnite = getAllUnite;
service.updateUnite = updateUnite;
service.addUnite = addUnite;

service.getAllVente = getAllVente;
service.updateVente = updateVente;

service.addfraisprev = addfraisprev;
service.getAllFrais = getAllFrais;

service.addLicence = addLicence;
service.getAllHome = getAllHome;

service.getByIduser = getByIduser;
service.getByIdDroit = getByIdDroit;

service.deleteuser = deleteuser;
service.updateuser = updateuser;

service.updateTest = updateTest;
service.getCompte = getCompte;
service.getComlic = getComlic;

service.addFormation = addFormation;
service.getAllFormation = getAllFormation;

service.getAlarmecaces = getAlarmecaces;
service.getAlarmeformation = getAlarmeformation;

module.exports = service;

/*---------------------------------------crypto------------------------------------------------*/
function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

/*---------------------------------------agence------------------------------------------------*/
function addagence(agenceParam) {
    var params;
    var deferred = Q.defer();
    //console.log(agenceParam);
    params = [
        agenceParam.id_contact,
        agenceParam.logo,
        agenceParam.villefact,
        agenceParam.colorpied,
        agenceParam.pied_page1,
        agenceParam.pied_page2,
        agenceParam.pied_page3,
        agenceParam.pied_page4,
        agenceParam.pied_page5,
        agenceParam.pied_page6,
        agenceParam.filigrane,
        agenceParam.responsable_a,
        agenceParam.adresse_a,
        agenceParam.dep_a,
        agenceParam.pays_a,
        agenceParam.tel_a,
        agenceParam.fax_a,
        agenceParam.mail_a,
        agenceParam.site_a,
        agenceParam.siret_a,
        agenceParam.nom_a,
        agenceParam.meteo,
        agenceParam.user,
        agenceParam.autre,
        agenceParam.image,
        agenceParam.id_entreprise

    ];

    var query = 'INSERT INTO agence (id_contact,logo,villefact,colorpied,pied_page1,pied_page2,pied_page3,pied_page4,pied_page5,pied_page6,filigrane,responsable_a,adresse_a,dep_a,pays_a,tel_a,fax_a,mail_a,site_a,siret_a,nom_a,meteo,user,autre,image,id_entreprise) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('error in agence service :' + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllAgence() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM agence  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}


function updateAgence(ag_param) {
    var deferred = Q.defer();
    //console.log(ag_param);

    var params = [
        ag_param.nom_a,
        ag_param.responsable_a,
        ag_param.adresse_a,
        ag_param.dep_a,
        ag_param.ville_a,
        ag_param.pays_a,
        ag_param.tel_a,
        ag_param.fax_a,
        ag_param.mail_a,
        ag_param.site_a,
        ag_param.siret_a,
        ag_param.villefact,
        ag_param.pied_page1,
        ag_param.pied_page2,
        ag_param.pied_page3,
        ag_param.pied_page4,
        ag_param.pied_page5,
        ag_param.pied_page6,
        ag_param.id_agence

    ];

    var query = 'UPDATE agence SET nom_a = ?, responsable_a= ?, adresse_a = ?, dep_a=?, ville_a=?, pays_a = ?, tel_a = ?, fax_a = ?, ' +
        ' mail_a =? ,site_a = ?, siret_a = ?,villefact = ?, pied_page1 = ?, pied_page2 = ?, pied_page3 = ?, pied_page4 = ?, pied_page5 = ?, pied_page6 = ? ' +
        'where id_agence =?';
    console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        //console.log(results)

        deferred.resolve(params);
    });
    return deferred.promise;
}



function getAllFili() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM agence  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}
/*----------------------------------------------------- TVA ----------------------------------------------------*/
function getAllTVA() {
    var deferred = Q.defer();
    db.query('SELECT  * , taux AS tauxf FROM tva  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateTva(ag_param) {
    var deferred = Q.defer();
    //console.log(ag_param);

    var params = [
        ag_param.taux,
        ag_param.id_tva

    ];

    var query = 'UPDATE tva SET taux = ? where id_tva =?';
    console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        //console.log(results)

        deferred.resolve(params);
    });
    return deferred.promise;
}

/*--------------------------categorie produit-----------------------------*/
function getAllCat() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM produit_categorie  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateCat(ag_param) {
    var deferred = Q.defer();
    //console.log(ag_param);

    var params = [
        ag_param.libelle,
        ag_param.id_cat

    ];

    var query = 'UPDATE produit_categorie SET libelle = ? where id_cat = ?';
    //console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        //console.log(results)

        deferred.resolve(params);
    });
    return deferred.promise;
}

function addCat(agenceParam) {
    var params;
    var deferred = Q.defer();
    //console.log(agenceParam);
    params = [
        agenceParam.libelle

    ];

    var query = 'INSERT INTO produit_categorie (libelle) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('error in agence service :' + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllUnite() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM cat_unite  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateUnite(ag_param) {
    var deferred = Q.defer();
    //console.log(ag_param);

    var params = [
        ag_param.libelle,
        ag_param.id_unite

    ];

    var query = 'UPDATE cat_unite SET libelle = ? where id_unite = ?';
    //console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        //console.log(results)

        deferred.resolve(params);
    });
    return deferred.promise;
}

function addUnite(agenceParam) {
    var params;
    var deferred = Q.defer();
    //console.log(agenceParam);
    params = [
        agenceParam.libelle

    ];

    var query = 'INSERT INTO cat_unite (libelle) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('error in agence service :' + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

/*--------------------condition générales ventes--------------------------------------*/
function getAllVente() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM cgv  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateVente(ag_param) {
    var deferred = Q.defer();
    console.log(ag_param);

    var params = [
        ag_param.texte,
        ag_param.id

    ];

    var query = 'UPDATE cgv SET texte = ? where id = ?';
    //console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        //console.log(results)

        deferred.resolve();
    });
    return deferred.promise;
}

/*--------------------------------frais prévisionel---------------------------*/

function addfraisprev(agenceParam) {
    var params;
    var deferred = Q.defer();
    //console.log(agenceParam);
    params = [
        agenceParam.taux,
        agenceParam.datepour_debut,
        agenceParam.datepour_fin,
        agenceParam.autrespour,
        agenceParam.user

    ];

    var query = 'INSERT INTO fraispourcentage (taux,datepour_debut,datepour_fin,autrespour,user) VALUES (?,?,?,?,?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('error in agence service :' + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllFrais() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM fraispourcentage  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

function addLicence(licenceParam) {
    var params;
    var deferred = Q.defer();
    //console.log(agenceParam);
    params = [
        licenceParam.num_licence

    ];

    var query = 'INSERT INTO licence (num_licence) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('error in licence service :' + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;

}

function getAllHome() {
    var deferred = Q.defer();
    db.query('SELECT  meteo FROM agence  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

function getByIduser(_id) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = 'SELECT * FROM users WHERE id  = ?';
    var inserts = [_id];

    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdDroit(idUser) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    db.query('SELECT * from usersdroits where id = ? ', [idUser], function (error, msg, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(conversation);
        deferred.resolve(msg);
    });
    return deferred.promise;
}

function deleteuser(_id) {
    console.log('DELETE FROM users WHERE id = ? ', [_id]);
    console.log('DELETE FROM usersdroits WHERE id = ? ', [_id]);
    var deferred = Q.defer();
    db.query('DELETE FROM users WHERE id = ? ', [_id], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    db.query('DELETE FROM usersdroits WHERE id = ? ', [_id], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}

function updateuser(user_param) {
    var deferred = Q.defer();
    console.log(user_param);

    var params = [
        user_param.lastname,
        user_param.firstname,
        user_param.username,
        user_param.statut,
        user_param.id

    ];

    var query = 'UPDATE users SET lastname = ? ,firstname = ? , username= ? ,statut = ? where id =?';
    console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        //console.log(results)

        deferred.resolve(params);
    });
    return deferred.promise;
}

/*****************************************************************test*******************************************************/


function updateTest(ag_param) {
    var deferred = Q.defer();

    var date = new Date();
    date.setYear(date.getFullYear() + 5);

    var params = [
        encrypt(date.toISOString()),
        ag_param.numtest
    ];

    var query = 'UPDATE  testing SET datedeb = NOW( ), datefin = ?, validate=1 WHERE numtest = ? and validate IS NOT TRUE';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });

    var query2 = 'INSERT INTO accept_right (date_accept,validate) VALUES (NOW(),1)';
    db.query(query2, function (error, results, fields) {
        if (error) {
            console.log('error in licence service :' + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}

function getCompte() {
    var deferred = Q.defer();

    db.query('SELECT * FROM testing', function (error, licences) {
        if (error) {
            deferred.reject(error.message);
        }

        var nbUsersMax = 0;

        // Filter only validate licences
        var licencesFiltered = licences.filter(function (e, i) {
            return licences[i].datefin;
        });

        // Decrypt the date
        for (var i = 0; i < licencesFiltered.length; i++) {
            var datefin = new Date(decrypt(licencesFiltered[i].datefin)).getTime();
            var date_now = new Date().getTime();
            if (datefin > date_now) {
                nbUsersMax += licencesFiltered[i].id_test;
            }
        }
        deferred.resolve(nbUsersMax);
    });

    return deferred.promise;
}

function getComlic() {
    var deferred = Q.defer();

    db.query('SELECT * FROM testing', function (error, licences) {
        if (error) {
            deferred.reject(error.message);
        }

        // Filter only validate licences
        var licencesFiltered = licences.filter(function (e, i) {
            return licences[i].datefin;
        });

        // Decrypt the date
        for (var i = 0; i < licencesFiltered.length; i++) {
            licencesFiltered[i].datefin = decrypt(licencesFiltered[i].datefin);
        }
        deferred.resolve(licencesFiltered);
    });

    return deferred.promise;
}

/********************************************FORMATION ************************************************************************************/

function addFormation(agenceParam) {
    var params;
    var deferred = Q.defer();
    //console.log(agenceParam);
    params = [
        agenceParam.name

    ];

    var query = 'INSERT INTO formation (name) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('error in agence service :' + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllFormation() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM formation  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

/*************************************************************HOME*****************************************************************************/

function getAlarmeformation() {
    var deferred = Q.defer();
    db.query('SELECT * FROM  formationalert ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}

function getAlarmecaces() {
    var deferred = Q.defer();
    db.query('SELECT * FROM  cacesalert ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(params);
        deferred.resolve(params);
    });
    return deferred.promise;
}