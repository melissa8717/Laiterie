/**
 * Created by Alexandre on 08/06/2017.
 */
var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mysql      = require('mysql');
var db = require('../db.js').get();


var service = {};
service.getAllChantier = getAllChantier;
service.getAll = getAll;
service.getById = getById;
service.delete = _delete;
service.create = create;

service.getByIdNom = getByIdNom;

service.getByIdTout = getByIdTout;
service.getByIdPhase=getByIdPhase;
service.updateFiche=updateFiche;
service.deletePhase = deletePhase;
service.addPhase = addPhase;
service.addRapport = addRapport;
service.deleteRappport = deleteRapport;
service.getByIdRapport = getByIdRapport;

service.getByIdCdevis =getByIdCdevis;
service.createChantier =createChantier;

service.getByIdDevis = getByIdDevis;
service.getByIdDevisoption = getByIdDevisoption;

service.getAllMois = getAllMois;
service.getAllCmois = getAllCmois;

service.getByIdPrev =getByIdPrev;
service.getByIdPrevopt = getByIdPrevopt;

service.getByIdDevischantier = getByIdDevischantier;
service.updateDevischantier = updateDevischantier;

service.getByIdAnalyse = getByIdAnalyse;
service.getByIdAnalyseoption = getByIdAnalyseoption;

service.getByIdReel = getByIdReel;

service.getByIdAcco = getByIdAcco;
service.getByIdTotalDevis = getByIdTotalDevis;
service.getByIdDevislibre = getByIdDevislibre;
service.getAllprevisionnel = getAllprevisionnel;
service.getByIdfraispre = getByIdfraispre;
service.getByIdfraisreel=getByIdfraisreel;
service.getByIdpourcentdevis = getByIdpourcentdevis;
service.getByIdBalance = getByIdBalance;

service.getByIdFacturechantier = getByIdFacturechantier;
service.getByIdmainreel=getByIdmainreel;




module.exports = service;


function getAll() {
    var deferred = Q.defer();
    db.query('SELECT * from chantier', function (error, chantier, fields)  {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}





function create(chantierParam) {
    //console.log("test1");
    var Params;
    var deferred = Q.defer();
    console.log(chantierParam);
    Params= [
        chantierParam.nom_chantier,
        chantierParam.id_contact,
        chantierParam. id_chantier,
        chantierParam.date_demarrage,
        chantierParam.reception_chantier,
        chantierParam.id_responsable,
        chantierParam.retenuegarantie,
        chantierParam.pourcentage,
        chantierParam.caution,
        chantierParam.banque,
        chantierParam.montant,
        chantierParam.maitreoeuvre,
        chantierParam.telmaitre,
        chantierParam.architecte,
        chantierParam.telarchi,
        chantierParam.autrecontact,
        chantierParam.telautre,
        chantierParam.telresponsable,
        chantierParam.telresponsablemob,
        chantierParam.responsable,
        chantierParam.statut
    ];
    var query = "INSERT INTO chantier (nom_chantier, id_contact, id_chantier, date_demarrage, reception_chantier, id_responsable,retenuegarantie,pourcentage,caution,banque,montant,maitreoeuvre,telmaitre,architecte,telarchi,autrecontact,telautre,telresponsable,telresponsablemob,responsable,statut) VALUES (? , ? , ? , ?, ?,? , ? , ? , ?, ?,? , ? , ? , ?, ?,? , ? , ? , ?,?)";

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


function _delete(_id) {
    var deferred = Q.defer();
    db.query("DELETE FROM chantier WHERE id_chantier = ? ", [_id], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve();
    });
    return deferred.promise;
}




function getById(_id) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM chantier WHERE id_chantier = ?";
    var inserts = [_id];
    sql = mysql.format(sql, inserts);
    db.query(sql, [_id], function (error, chantier, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(chantier);
    });
    return deferred.promise;
}






function update(id_chantier, chantierParam) {
    //console.log("update chantier service server");
    var deferred = Q.defer();

    var params = [
        chantierParam.id_contact,
        chantierParam.id_chantier,

        chantierParam.nom_chantier,
        chantierParam.id_responsable,
        chantierParam.ville


    ];

    var query = "UPDATE chantier SET id_contact = ?, id_chantier = ?, nom_chantier = ?, id_responsable = ?, ville = ? WHERE id_chantier = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | '+ error.message);
        }


        deferred.resolve();
    });
    return deferred.promise;
}

/*-------------------------liste chantier----------------------------*/

function getAllChantier() {
    var deferred = Q.defer();
    //console.log('test3');
    db.query('SELECT chantier.nom_chantier, chantier.id_chantier, chantier.responsable,chantier.status, adresse.ville as ville, contact.nom as nom  FROM chantier, adresse, contact \ WHERE chantier.id_chantier = adresse.id_chantier AND chantier.id_contact = contact.id_contact ORDER BY chantier.id_chantier DESC' ,function (error, chantier, fields)  {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

/*--------------------------------------nom chantier-----------------------------------------------*/

function getByIdNom(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT chantier.nom_chantier, chantierdevis.date_demarrage, chantierdevis.reception_chantier, chantier.id_chantier " +
        "FROM chantier, chantierdevis " +
        "WHERE chantierdevis.id_chantier =? AND chantier.id_chantier = chantierdevis.id_chantier " +
        "GROUP by chantier.id_chantier ";
    var inserts = [_id_chantier];

    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

/*------------------------------modifier chantier-------------------------------------------*/

function getByIdTout(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT chantier . * , adresse . * , contact.nom, contact.raison_sociale " +
        " FROM chantier,adresse, contact WHERE chantier.id_chantier =? " +
        "AND chantier.id_chantier = adresse.id_chantier AND chantier.id_contact = contact.id_contact";
    var inserts = [_id_chantier];

    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdPhase(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT  * FROM phase WHERE id_chantier = ? ORDER BY date_creation ASC";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function deletePhase(_id_phase) {
    //console.log("DELETE FROM phase WHERE id_phase = ? ", [_id_phase]);
    var deferred = Q.defer();
    db.query("DELETE FROM phase WHERE id_phase = ? ", [_id_phase], function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}

function addPhase(EParams,id_chantier) {
    var deferred = Q.defer();
    //console.log("test10");

    var params = [
        id_chantier,
        EParams.nom_phase,
        EParams.date_creation

    ];

    var query = "INSERT INTO phase (id_chantier, nom_phase, date_creation) VALUES (? , ? , ?) ";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdRapport(_id_chantier) {
    //console.log('Dieu');
    var deferred = Q.defer();
    var sql = "SELECT  * FROM rapport_chantier WHERE id_chantier = ? ORDER BY date_rapport ASC";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function addRapport(EParams,id_chantier) {
    var deferred = Q.defer();
    console.log("test10");

    var params = [
        id_chantier,
        EParams.note,
        EParams.date_rapport

    ];

    var query = "INSERT INTO rapport_chantier (id_chantier, note, date_rapport) VALUES (? , ? , ?)";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function deleteRapport(_id_rapport) {
    //console.log("DELETE FROM chantier_rapport WHERE id_rapport = ? ", [_id_rapport]);
    var deferred = Q.defer();
    db.query("DELETE FROM chantier_rapport WHERE id_rapport = ? ", [_id_rapport], function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}


function updateFiche(chantier_param) {
    var deferred = Q.defer();
    //console.log(chantier_param.model);


    db.query("UPDATE chantier SET date_demarrage=?, reception_chantier=?, id_responsable=?,retenuegarantie=?,pourcentage=?,caution=?,banque=?,montant=?,maitreoeuvre=?,telmaitre=?,architecte=?,telarchi=?,autrecontact=?,telautre=?,telresponsable=?,telresponsablemob=?,responsable=?, status =? WHERE id_chantier = ?",
        [chantier_param.model.date_demarrage,chantier_param.model.reception_chantier,chantier_param.model.id_responsable,chantier_param.model.retenuegarantie,chantier_param.model.pourcentage,chantier_param.model.caution,chantier_param.model.banque,chantier_param.model.montant,chantier_param.model.maitreoeuvre,chantier_param.model.telmaitre,chantier_param.model.architecte,chantier_param.model.telarchi,chantier_param.model.autrecontact,chantier_param.model.telautre,chantier_param.model.telresponsable,chantier_param.model.telresponsablemob,chantier_param.model.responsable,chantier_param.model.status,chantier_param.model.id_chantier] ,

        function (error, results, fields) {
            if (error){
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            db.query("UPDATE chantierdevis SET  date_demarrage=? and DATE_ADD(date_demarrage, INTERVAL +2 HOUR), reception_chantier=? and DATE_ADD(reception_chantier, INTERVAL +2 HOUR),status=? WHERE id_chantier = ? and id_devis =?",
                [chantier_param.model.date_demarrage, chantier_param.model.reception_chantier,chantier_param.model.status,chantier_param.model.id_chantier,chantier_param.model.id_devis],
                function (error, results, fields) {
                    if (error){
                        deferred.reject(error.name + ': ' + error.message);
                        console.log(error.name + ': ' + error.message);
                    }
                    deferred.resolve()

                });


            db.query("UPDATE adresse SET  adresse =? , code_postal=? ,ville=? where id_chantier =? ",
                [ chantier_param.model.adresse ,chantier_param.model.code_postal,chantier_param.model.ville,chantier_param.model.id_chantier ],
                function (error, result, fields) {
                    if (error) {
                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                    }
                    deferred.resolve()

                });


        });
    return deferred.promise;
}



function getByIdCdevis(_id_devis,_num_version) {
    //console.log('chantier');
    var deferred = Q.defer();
    var sql = "SELECT devis.* , contact.nom, contact.prenom, contact.titre , devis_version.num_version FROM devis, contact, devis_version " +
        "WHERE devis_version.id_devis = ? AND devis_version.num_version = ? " +
        "AND devis.id_contact=contact.id_contact " +
        "AND devis.id_devis = devis_version.id_devis";
    var inserts = [_id_devis,_num_version];


    sql = mysql.format(sql, inserts);console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function createChantier(chantier_param) {
    var deferred = Q.defer();
    //console.log(chantier_param.model);


    db.query("INSERT INTO chantier (nom_chantier, id_contact,date_demarrage, reception_chantier,id_responsable,retenuegarantie,pourcentage,caution,banque,montant,maitreoeuvre,telmaitre,architecte,telarchi,autrecontact,telautre,telresponsable,telresponsablemob,responsable,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
        [chantier_param.model.nom_chantier ,chantier_param.model.id_contact,chantier_param.model.date_demarrage, chantier_param.model.reception_chantier,chantier_param.model.id_responsable,chantier_param.model.retenuegarantie,chantier_param.model.pourcentage,chantier_param.model.caution,chantier_param.model.banque,chantier_param.model.montant,chantier_param.model.maitreoeuvre,chantier_param.model.telmaitre,chantier_param.model.architecte,chantier_param.model.telarchi,chantier_param.model.autrecontact,chantier_param.model.telautre,chantier_param.model.telresponsable,chantier_param.model.telresponsablemob,chantier_param.model.responsable,chantier_param.model.status],
        function (error, results, fields) {
            if (error){
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            db.query("INSERT INTO chantierdevis (id_chantier, id_devis, num_version,status,date_demarrage,reception_chantier,id_contact) VALUES (? , ? , ? , ? , ? , ?,?  )",
                [results.insertId , chantier_param.model.id_devis ,chantier_param.model.num_version,chantier_param.model.status,chantier_param.model.date_demarrage, chantier_param.model.reception_chantier,chantier_param.model.id_contact ],
                function (error, result, fields) {
                    if (error) {
                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                    }
                    deferred.resolve()

                });

            db.query("UPDATE devis_version SET `accepted` = 1 WHERE id_devis=? AND num_version = ?",
                [chantier_param.model.id_devis ,chantier_param.model.num_version ],
                function (error, result, fields) {
                    if (error) {
                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                    }
                    deferred.resolve()

                });

            db.query("UPDATE devis SET `valide` = 1 WHERE id_devis= ? ",
                [chantier_param.model.id_devis ],
                function (error, result, fields) {
                    if (error) {
                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                    }
                    deferred.resolve()

                });

            db.query("INSERT INTO adresse (id_chantier, adresse, code_postal,ville) VALUES (? , ? , ? , ?  )",
                [results.insertId , chantier_param.model.adresse ,chantier_param.model.cp,chantier_param.model.ville ],
                function (error, result, fields) {
                    if (error) {
                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                    }
                    deferred.resolve()

                });


        });
    return deferred.promise;
}
/*------------------------------------produit devis du chantier------------------------------------------*/

function getByIdDevis(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT produit_compose.id_produit AS compose, produit_compose.quantite, devis_detaille. * , produit_vente.libelle AS produitvente, produit.prix_achat, produit.salaire_charge,produit.libelle, produit.id_contact, contact.nom, produit.unite "+
        "FROM chantierdevis, devis_detaille, produit_vente, produit_compose, produit, contact "+
        "WHERE chantierdevis.id_chantier =? "+
        "AND chantierdevis.status !=  'terminé' "+
        "AND (chantierdevis.id_devis = devis_detaille.id_devis AND chantierdevis.num_version = devis_detaille.num_version) "+
        "AND (devis_detaille.id_produit = produit_vente.id_prc AND devis_detaille.produit_version = produit_vente.num_version) "+
        "AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) "+
        "AND produit.id_produit = produit_compose.id_produit "+
        "AND produit.num_version = produit_compose.achat_version "+
        "AND produit.prix_achat >0 "+
        "AND produit.id_contact = contact.id_contact " ;
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            // console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}
function getByIdDevisoption(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT produit_compose.id_produit AS compose, produit_compose.quantite, devis_option. * , produit_vente.libelle AS produitvente, produit.prix_achat, produit.salaire_charge,produit.libelle, produit.id_contact, contact.nom, produit.unite "+
        "FROM chantierdevis, devis_option, produit_vente, produit_compose, produit, contact "+
        "WHERE chantierdevis.id_chantier = ? " +
        "AND chantierdevis.status !=  'terminé' "+
        "AND (chantierdevis.id_devis = devis_option.id_devis AND chantierdevis.num_version = devis_option.num_version AND devis_option.accepted IS TRUE) "+
        "AND (devis_option.id_produit = produit_vente.id_prc AND devis_option.produit_version = produit_vente.num_version) "+
        "AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) "+
        "AND produit.id_produit = produit_compose.id_produit "+
        "AND produit.num_version = produit_compose.achat_version "+
        "AND produit.prix_achat >0 "+
        "AND produit.id_contact = contact.id_contact ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

/*---------------------------------------chantier mois-----------------------------------------*/

function getAllMois(month, year) {
    var deferred = Q.defer();
    console.log('test6');
    db.query('SELECT listchantierfacturemois. * , listchantierdevismois. *,listchantierdevisoption.* , chantierdevis.date_demarrage, chantierdevis.status,adresse.ville,contact.nom '+
        'FROM listchantierfacturemois, chantier, chantierdevis, listchantierdevismois,contact,adresse,listchantierdevisoption '+
        'WHERE chantier.id_chantier = chantierdevis.id_chantier '+
        'AND chantier.id_contact =contact.id_contact '+
        'AND chantier.id_chantier=adresse.id_chantier '+
        'AND chantierdevis.id_chantier = listchantierfacturemois.id_chantier '+
        'AND chantierdevis.id_chantier = listchantierdevisoption.id_chantier '+
        'AND chantierdevis.id_chantier = listchantierdevismois.id_chantier '+
        'AND ((MONTH( chantierdevis.date_demarrage ) =? AND YEAR( chantierdevis.date_demarrage ) =? ) '+
        'OR (chantierdevis.status =  "en cours"))',[month, year] ,function (error, chantier, fields)  {
        if (error) {
            //console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllCmois() {
    var deferred = Q.defer();
    db.query('SELECT chantierdevisencours. * , facturechantiercours. * , chantier.nom_chantier, chantier.date_demarrage, contact.nom , adresse.ville '+
        'FROM adresse, contact, chantierdevisencours '+
        'LEFT JOIN facturechantiercours ON chantierdevisencours.id_devis = facturechantiercours.id_devis '+
        'LEFT JOIN chantier ON chantierdevisencours.id_chantier = chantier.id_chantier '+
        'LEFT JOIN chantierdevis ON chantierdevisencours.id_devis = chantierdevis.id_devis '+
        'WHERE contact.id_contact = chantier.id_contact AND adresse.id_chantier = chantier.id_chantier', function (error, chantier, fields)  {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

/*------------------------------------liste devis chantier-------------------------------------*/

function getByIdDevischantier(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT  * FROM chantierdevis WHERE id_chantier = ? ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}


function updateDevischantier(chantierParam) {
    console.log("update chantier devis service server");
    var deferred = Q.defer();

    var params = [
        chantierParam.date_demarrage,
        chantierParam.reception_chantier,
        chantierParam.status,
        chantierParam.id_chantier,
        chantierParam.id_devis,
        chantierParam.num_version


    ];

    var query = "UPDATE chantierdevis SET date_demarrage=?,reception_chantier=?,status=? WHERE id_chantier = ? AND id_devis = ? AND num_version =? ";
    console.log(query, params)
    db.query(query, params, function (error, results, fields) {
        if (error) {
            //console.log(+ error.message)
            deferred.reject('MySql ERROR trying to update user informations (3) | '+ error.message);
        }
        //console.log(results)

        deferred.resolve();
    });
    return deferred.promise;
}

/*-------------------------------prévisionnelle--------------------------------------------*/

function getByIdPrev(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT produit_compose.id_produit AS compose, produit_compose.quantite, devis_detaille. * , produit_vente.libelle AS produitvente, produit.prix_achat, produit.salaire_charge,produit.libelle, produit.id_contact "+
        "FROM chantierdevis, devis_detaille, produit_vente, produit_compose, produit "+
        "WHERE chantierdevis.id_chantier =? "+
        "AND chantierdevis.status !=  'terminé' "+
        "AND (chantierdevis.id_devis = devis_detaille.id_devis AND chantierdevis.num_version = devis_detaille.num_version) "+
        "AND (devis_detaille.id_produit = produit_vente.id_prc AND devis_detaille.produit_version = produit_vente.num_version) "+
        "AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) "+
        "AND produit.id_produit = produit_compose.id_produit "+
        "AND produit.num_version = produit_compose.achat_version ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            // console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdPrevopt(_id_chantier) {
    // console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT produit_compose.id_produit AS compose, produit_compose.quantite, devis_option. * , produit_vente.libelle AS produitvente, produit.libelle AS nom, produit.prix_achat, produit.salaire_charge,produit.libelle, produit.id_contact "+
        "FROM chantierdevis, devis_option, produit_vente, produit_compose, produit "+
        "WHERE chantierdevis.id_chantier = ? "+
        "AND chantierdevis.status !=  'terminé' "+
        "AND (chantierdevis.id_devis = devis_option.id_devis AND chantierdevis.num_version = devis_option.num_version AND devis_option.accepted IS TRUE) "+
        "AND (devis_option.id_produit = produit_vente.id_prc AND devis_option.produit_version = produit_vente.num_version) "+
        "AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) "+
        "AND produit.id_produit = produit_compose.id_produit "+
        "AND produit.num_version = produit_compose.achat_version AND produit.prix_achat > 0";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            // console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

/*---------------------------------analyse temps-----------------------------------------------------------*/

function getByIdAnalyse(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT produit. * , produit_vente.libelle AS compose, produit_compose.quantite, devis_detaille.qte_devis "+
        "FROM chantierdevis, devis_detaille, produit_vente, produit_compose, produit "+
        "WHERE chantierdevis.id_chantier =? "+
        "AND chantierdevis.status !=  'terminé' "+
        "AND (chantierdevis.id_devis = devis_detaille.id_devis AND chantierdevis.num_version = devis_detaille.num_version) "+
        "AND (devis_detaille.id_produit = produit_vente.id_prc AND devis_detaille.produit_version = produit_vente.num_version) "+
        "AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) "+
        "AND produit.id_produit = produit_compose.id_produit "+
        "AND produit.num_version = produit_compose.achat_version "+
        "AND produit.salaire_charge >0";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            // console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}
function getByIdAnalyseoption(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT produit. * , produit_vente.libelle AS compose, produit_compose.quantite, devis_option.qte_devis "+
        "FROM chantierdevis, devis_option, produit_vente, produit_compose, produit "+
        "WHERE chantierdevis.id_chantier = ? "+
        "AND chantierdevis.status !=  'terminé' "+
        "AND (chantierdevis.id_devis = devis_option.id_devis AND chantierdevis.num_version = devis_option.num_version) "+
        "AND (devis_option.id_produit = produit_vente.id_prc AND devis_option.produit_version = produit_vente.num_version) "+
        "AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) "+
        "AND produit.id_produit = produit_compose.id_produit "+
        "AND produit.num_version = produit_compose.achat_version "+
        "AND produit.salaire_charge >0";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            // console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

/*-----------------depense reel------------------------*/
function getByIdReel(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT bon_de_commande. * , bdc_detaille.id_bdc, SUM( Qtelivre * Prixreel ) AS total, contact.nom "+
        "FROM bon_de_commande "+
        "LEFT JOIN bdc_detaille ON bon_de_commande.id_bdc = bdc_detaille.id_bdc "+
        "LEFT JOIN contact ON bon_de_commande.id_fournisseur = contact.id_contact "+
        "WHERE id_chantier = ? "+
        "AND bon_de_commande.recu IS TRUE "+
        "GROUP BY bdc_detaille.id_bdc";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

/*---------------------------------balance chantier-------------------------------------------*/

function getByIdAcco(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT  devis_version .* FROM chantierdevis, devis_version WHERE id_chantier = ? AND STATUS =  'en cours' " +
        "AND (devis_version.id_devis = chantierdevis.id_devis AND devis_version.num_version = chantierdevis.num_version)";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts); //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdTotalDevis(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT devisList. * " +
        "FROM  `devisList` , chantierdevis, devis_version " +
        "WHERE devisList.id_devis = chantierdevis.id_devis " +
        "AND chantierdevis.id_chantier =? " +
        "AND (chantierdevis.status =  'en cours' AND chantierdevis.id_devis = devis_version.id_devis AND devis_version.num_version = chantierdevis.num_version)  " +
        "AND ( devis_version.id_devis = devisList.id_devis AND devis_version.num_version = devisList.num_version ) " +
        "AND devisList.accepted IS TRUE ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdDevislibre(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT devis_version.montantht "+
        "FROM chantierdevis, devis_version "+
        "WHERE chantierdevis.id_chantier = ? "+
        "AND chantierdevis.id_devis = devis_version.id_devis "+
        "AND chantierdevis.num_version = devis_version.num_version "+
        "AND devis_version.montantht >0";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getAllprevisionnel(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT devisfrais. * FROM chantierdevis, devisfrais "+
        "WHERE chantierdevis.id_chantier = ? "+
        "AND chantierdevis.status = 'en cours' "+
        "AND ((chantierdevis.date_demarrage >= devisfrais.date_demarrage AND devisfrais.status = 'en cours') "+
        "OR (chantierdevis.date_demarrage <= devisfrais.reception_chantier AND devisfrais.status = 'terminé'))";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

//réel erreur
function getByIdfraispre(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT fraismoisannee. * "+
        "FROM chantierdevis, fraismoisannee "+
        "WHERE chantierdevis.id_chantier = ? "+
        "AND chantierdevis.status =  'en cours' "+
        "AND (MONTH( date_demarrage ) >= fraismoisannee.mois AND YEAR( date_demarrage ) >= fraismoisannee.annee) "+
        "GROUP BY fraismoisannee.mois, fraismoisannee.annee ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

//erreur c'est previsionnel
function getByIdfraisreel(_id_chantier) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT fraisgeneraux. * FROM chantierdevis "+
        "LEFT JOIN fraisgeneraux ON fraisgeneraux.date_debut BETWEEN chantierdevis.date_demarrage AND chantierdevis.reception_chantier "+
        "WHERE chantierdevis.status =  'en cours' AND chantierdevis.id_chantier =? ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdpourcentdevis(_id_chantier) {
    //console.log('test3');
    var deferred = Q.defer();
    var sql = "SELECT devisfrais. * "+
        "FROM chantierdevis, devisfrais "+
        "WHERE (chantierdevis.id_chantier = ? AND chantierdevis.status =  'en cours') "+
        "AND ((MONTH( chantierdevis.date_demarrage ) <= devisfrais.devismois AND YEAR( chantierdevis.date_demarrage ) <= devisfrais.devisannee AND devisfrais.status =  'en cours') "+
        "OR (MONTH( chantierdevis.date_demarrage ) = devisfrais.devismois AND YEAR( chantierdevis.date_demarrage ) = devisfrais.devisannee AND devisfrais.status =  'terminé')) ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdmainreel(_id_chantier) {
    //console.log('test3');
    var deferred = Q.defer();
    var sql = "SELECT travail. * , contrat_histo.tauxsurcharge, contrat_histo.type_contrat, contact.nom " +
        "FROM travail, contrat_histo, chantierdevis, contact " +
        "WHERE (chantierdevis.id_chantier =? " +
        "AND chantierdevis.status =  'en cours' " +
        "AND chantierdevis.date_demarrage <= travail.date) " +
        "AND chantierdevis.id_chantier = travail.id_chantier " +
        "AND contrat_histo.id_contact = travail.id_employé " +
        "AND contact.id_contact = travail.id_employé " +
        "ORDER BY id_contrat DESC LIMIT 1 ";
    var inserts = [_id_chantier];
    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}


function getByIdBalance(_id_chantier) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "SELECT * FROM chantierdevis WHERE id_chantier = ? AND status =  'en cours' ";
    var inserts = [_id_chantier];

    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

/*------------------------------------liste facture chantier-----------------------------------*/

function getByIdFacturechantier(_id_chantier) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "SELECT facture.*,chantier.nom_chantier,chantierdevis.date_demarrage,chantierdevis.status FROM devis, chantier, facture,chantierdevis WHERE chantier.id_chantier = ? AND chantier.id_chantier = chantierdevis.id_chantier AND chantierdevis.status =  'en cours' AND devis.id_devis = chantierdevis.id_devis AND devis.id_devis = facture.id_devis";
    var inserts = [_id_chantier];

    sql = mysql.format(sql, inserts);//console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}



