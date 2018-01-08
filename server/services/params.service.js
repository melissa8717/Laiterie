/**
 * Created by Wbat on 17/07/2017.
 */
let Q = require('q');
let mysql = require('mysql');
let crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'wbat2017-secret-hashing-password';

let db = require('../db.js').get();

let service = {};

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
service.addVente = addVente;

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
service.getVisitemedicale = getVisitemedicale;

module.exports = service;

/*---------------------------------------crypto------------------------------------------------*/
function encrypt(text) {
    let cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    let decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

/*---------------------------------------agence------------------------------------------------*/
function addagence(agenceParam) {
    let params;
    let deferred = Q.defer();
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

    let query = 'INSERT INTO agence (id_contact,logo,villefact,colorpied,pied_page1,pied_page2,pied_page3,pied_page4,pied_page5,pied_page6,filigrane,responsable_a,adresse_a,dep_a,pays_a,tel_a,fax_a,mail_a,site_a,siret_a,nom_a,meteo,user,autre,image,id_entreprise) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllAgence() {
    let deferred = Q.defer();
    db.query('SELECT  * FROM agence  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}


function updateAgence(ag_param) {
    let deferred = Q.defer();

    let params = [
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

    let query = 'UPDATE agence SET nom_a = ?, responsable_a= ?, adresse_a = ?, dep_a=?, ville_a=?, pays_a = ?, tel_a = ?, fax_a = ?, ' +
        ' mail_a =? ,site_a = ?, siret_a = ?,villefact = ?, pied_page1 = ?, pied_page2 = ?, pied_page3 = ?, pied_page4 = ?, pied_page5 = ?, pied_page6 = ? ' +
        'where id_agence =?';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve(params);
    });
    return deferred.promise;
}



function getAllFili() {
    let deferred = Q.defer();
    db.query('SELECT  * FROM agence  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}
/*----------------------------------------------------- TVA ----------------------------------------------------*/
function getAllTVA() {
    let deferred = Q.defer();
    db.query('SELECT  * , taux AS tauxf FROM tva  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateTva(ag_param) {
    let deferred = Q.defer();

    let params = [
        ag_param.taux,
        ag_param.id_tva

    ];

    let query = 'UPDATE tva SET taux = ? where id_tva =?';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve(params);
    });
    return deferred.promise;
}

/*--------------------------categorie produit-----------------------------*/
function getAllCat() {
    let deferred = Q.defer();
    db.query('SELECT  * FROM produit_categorie  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateCat(ag_param) {
    let deferred = Q.defer();

    let params = [
        ag_param.libelle,
        ag_param.id_cat

    ];

    let query = 'UPDATE produit_categorie SET libelle = ? where id_cat = ?';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve(params);
    });
    return deferred.promise;
}

function addCat(agenceParam) {
    let params;
    let deferred = Q.defer();
    params = [
        agenceParam.libelle

    ];

    let query = 'INSERT INTO produit_categorie (libelle) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllUnite() {
    let deferred = Q.defer();
    db.query('SELECT  * FROM cat_unite  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateUnite(ag_param) {
    let deferred = Q.defer();

    let params = [
        ag_param.libelle,
        ag_param.id_unite

    ];

    let query = 'UPDATE cat_unite SET libelle = ? where id_unite = ?';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve(params);
    });
    return deferred.promise;
}

function addUnite(agenceParam) {
    let params;
    let deferred = Q.defer();
    params = [
        agenceParam.libelle

    ];

    let query = 'INSERT INTO cat_unite (libelle) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

    });

    return deferred.promise;
}

/*--------------------condition générales ventes--------------------------------------*/
function getAllVente() {
    let deferred = Q.defer();
    db.query('SELECT  * FROM cgv  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function updateVente(ag_param) {
    let deferred = Q.defer();

    let params = [
        ag_param.texte,
        ag_param.id

    ];

    let query = 'UPDATE cgv SET texte = ? where id = ?';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve();
    });
    return deferred.promise;
}

function addVente(ag_param) {
    let deferred = Q.defer();

    let params = [
        ag_param.texte,
        ag_param.id

    ];

    let query = 'INSERT INTO  cgv (texte) VALUES (?)';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve();
    });
    return deferred.promise;
}

/*--------------------------------frais prévisionel---------------------------*/

function addfraisprev(agenceParam) {
    let params;
    let deferred = Q.defer();
    params = [
        agenceParam.taux,
        agenceParam.datepour_debut,
        agenceParam.datepour_fin,
        agenceParam.autrespour,
        agenceParam.user

    ];

    let query = 'INSERT INTO fraispourcentage (taux,datepour_debut,datepour_fin,autrespour,user) VALUES (?,?,?,?,?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllFrais() {
    let deferred = Q.defer();
    db.query('SELECT  * FROM fraispourcentage  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function addLicence(licenceParam) {
    let params;
    let deferred = Q.defer();
    params = [
        licenceParam.num_licence

    ];

    let query = 'INSERT INTO licence (num_licence) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

    });

    return deferred.promise;

}

function getAllHome() {
    let deferred = Q.defer();
    db.query('SELECT  meteo FROM agence  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function getByIduser(_id) {
    let deferred = Q.defer();
    let sql = 'SELECT * FROM users WHERE id  = ?';
    let inserts = [_id];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdDroit(idUser) {
    let deferred = Q.defer();
    db.query('SELECT * from usersdroits where id = ? ', [idUser], function (error, msg, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(msg);
    });
    return deferred.promise;
}

function deleteuser(_id) {
    let deferred = Q.defer();
    db.query('DELETE FROM users WHERE id = ? ', [_id], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    db.query('DELETE FROM usersdroits WHERE id = ? ', [_id], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}

function updateuser(user_param) {
    let deferred = Q.defer();

    let params = [
        user_param.lastname,
        user_param.firstname,
        user_param.username,
        user_param.statut,
        user_param.id

    ];

    let query = 'UPDATE users SET lastname = ? ,firstname = ? , username= ? ,statut = ? where id =?';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve(params);
    });
    return deferred.promise;
}

/*****************************************************************test*******************************************************/


function updateTest(ag_param) {
    let deferred = Q.defer();

    let date = new Date();
    date.setYear(date.getFullYear() + 5);

    let params = [
        encrypt(date.toISOString()),
        ag_param.numtest
    ];

    let query = 'UPDATE  testing SET datedeb = NOW( ), datefin = ?, validate=1 WHERE numtest = ? and validate IS NOT TRUE';
    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });

    let query2 = 'INSERT INTO accept_right (date_accept,validate) VALUES (NOW(),1)';
    db.query(query2, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}

function getCompte() {
    let deferred = Q.defer();

    db.query('SELECT * FROM testing', function (error, licences) {
        if (error) {
            deferred.reject(error.message);
        }

        let nbUsersMax = 0;

        // Filter only validate licences
        let licencesFiltered = licences.filter(function (e, i) {
            return licences[i].datefin;
        });

        // Decrypt the date
        for (let i = 0; i < licencesFiltered.length; i++) {
            let datefin = new Date(decrypt(licencesFiltered[i].datefin)).getTime();
            let date_now = new Date().getTime();
            if (datefin > date_now) {
                nbUsersMax += licencesFiltered[i].nbi_user;
            }
        }
        deferred.resolve(nbUsersMax);
    });

    return deferred.promise;
}

function getComlic() {
    let deferred = Q.defer();

    db.query('SELECT * FROM testing', function (error, licences) {
        if (error) {
            deferred.reject(error.message);
        }

        // Filter only validate licences
        let licencesFiltered = licences.filter(function (e, i) {
            return licences[i].datefin;
        });

        // Decrypt the date
        for (let i = 0; i < licencesFiltered.length; i++) {
            licencesFiltered[i].datefin = decrypt(licencesFiltered[i].datefin);
        }
        deferred.resolve(licencesFiltered);
    });

    return deferred.promise;
}

/********************************************FORMATION ************************************************************************************/

function addFormation(agenceParam) {
    let params;
    let deferred = Q.defer();
    params = [
        agenceParam.name

    ];

    let query = 'INSERT INTO formation (name) VALUES (?)';

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllFormation() {
    let deferred = Q.defer();
    db.query('SELECT  * FROM formation  ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

/*************************************************************HOME*****************************************************************************/

function getAlarmeformation() {
    let deferred = Q.defer();
    db.query('SELECT * FROM formationalert UNION SELECT DATE AS DATE, caces AS designation, nom, prenom FROM cacesalert ORDER BY  `DATE` ASC', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function getAlarmecaces() {
    let deferred = Q.defer();
    db.query('SELECT facture.* , facture.id_version AS taux, contact.nom, contact.prenom FROM facture '+
    'LEFT JOIN contact ON contact.id_contact = facture.id_contact WHERE facture.id_devis IS NULL AND facture.id_version IS NOT NULL '+
    'AND date_fact BETWEEN (NOW( ) - INTERVAL 14 MONTH) AND (NOW( ) - INTERVAL 10 MONTH) GROUP BY facture.id_facture '+
    'UNION '+
    'SELECT facture. * , devis_version.taux, contact.nom, contact.prenom FROM contact, devis_version '+
    'LEFT JOIN facture ON facture.id_devis = devis_version.id_devis AND facture.id_version = devis_version.num_version '+
    'LEFT JOIN devis ON devis_version.id_devis = devis.id_devis WHERE devis_version.taux >0 '+
    'AND date_fact BETWEEN (NOW( ) - INTERVAL 14 MONTH) AND (NOW( ) - INTERVAL 10 MONTH) '+
    'AND contact.id_contact = devis.id_contact  GROUP BY facture.id_facture ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}

function getVisitemedicale() {
    let deferred = Q.defer();
    db.query('SELECT visite_medicale AS DATE, nom, prenom FROM  `contact` WHERE visite_medicale ' +
        'BETWEEN NOW( ) AND (NOW( ) + INTERVAL 1 MONTH) ', function (error, params, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(params);
    });
    return deferred.promise;
}