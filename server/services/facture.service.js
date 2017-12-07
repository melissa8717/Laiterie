/**
 * Created by cédric on 10/07/2017.
 */
var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var service = {};

service.getAllFacture = getAllFacture;
service.getAllFooter = getALLFooter;
service.getAllnfact = getAllnfact;

service.getByIdFacture = getByIdFacture;
service.getByIdRetenu = getByIdRetenu;
service.getByIdVersion = getByIdVersion;
service.getByIdDetail = getByIdDetail;
service.getByIdOption = getByIdOption;
service.getbyIdTotalfact = getbyIdTotalfact;
service.getbyIdTotalopt = getbyIdTotalopt;
service.create = create;

service.getByIdModif = getByIdModif;
service.getByIdSituation = getByIdSituation;
service.getByIdTotalSit = getByIdTotalSit;
service.getByIdOptSit = getByIdOptSit;
service.getByIdValeur = getByIdValeur;
service.getByIdSitoption = getByIdSitoption;
service.createSituation = createSituation;

service.getByIdListeFacture = getByIdListeFacture;
service.getByIdNom = getByIdNom;

service.getAllFournisseur = getAllFournisseur;
service.getAllBdcdetail = getAllBdcdetail;
service.createfacturefournisseur = createfacturefournisseur;
service.getAllMois = getAllMois;
service.getByIdFournisseur = getByIdFournisseur;
service.getByIdBDC = getByIdBDC;
service.updateBDC = updateBDC;

service.getALLFraiscategorie = getALLFraiscategorie;
service.addfrais = addfrais;
service.getAllFraismois = getAllFraismois;
service.updateFraismois = updateFraismois;
service.deleteFrais = deleteFrais;

service.getAllPrev = getAllPrev;
service.addprev = addprev;

service.getAllAnnee = getAllAnnee;
service.getAllYprev = getAllYprev;

service.getAlltotalfact = getAlltotalfact;
service.getAlltotaldevis = getAlltotaldevis;
service.getAlldevisachat = getAlldevisachat;
service.getAllOptionachat = getAllOptionachat;
service.getAllFraisan = getAllFraisan;
service.getAllMoan = getAllMoan;
service.getAllBdcreel = getAllBdcreel;
service.getAllAnnefrais = getAllAnnefrais;
service.getAllFraispour = getAllFraispour;


service.getByIdPrimSit = getByIdPrimSit;
service.getByIdPrimOpt = getByIdPrimOpt;
service.getByIdAccpt = getByIdAccpt;


service.getAllNavoir = getAllNavoir;
service.addavoir = addavoir;
service.getAllListavoir = getAllListavoir;
service.getByIdAvoir = getByIdAvoir;
service.getByIdPeodavoir = getByIdPeodavoir;
service.getByIdPeodavlibre = getByIdPeodavlibre;

service.addacompte = addacompte;
service.getByIdAcopmte = getByIdAcopmte;

service.Flibre = Flibre;
service.getByIdLibreModif = getByIdLibreModif;
service.getByIdLibrebase = getByIdLibrebase;
service.getByIdLibredetail = getByIdLibredetail;
service.getByIdLibresum = getByIdLibresum ;
service.createSituationlibre = createSituationlibre;
service.getByIdLibresumimprim = getByIdLibresumimprim;
service.getByIdLibrebaseimprim = getByIdLibrebaseimprim;
service.getByIdLibredetailimprim = getByIdLibredetailimprim;

service.getByIdAvoirlibre = getByIdAvoirlibre;
service.addavoirlibre = addavoirlibre;

service.getByIdDevislibre = getByIdDevislibre;
service.getByIdDevislibreoption = getByIdDevislibreoption;
service.getByIdlibresituationoption = getByIdlibresituationoption;
service.getByIdlibresituation = getByIdlibresituation;
service.getByIdTotlafact = getByIdTotlafact;
service.getByIdTotlaTVA = getByIdTotlaTVA;

module.exports = service;

function getAllFacture() {
    var deferred = Q.defer();
    //console.log('ttest');
    db.query(' SELECT contact.id_contact AS contact, contact.nom AS nom, facture.id_facture, facture.nfactclient, facture.n_situation, facture.factured, facture.id_devis AS devis, facture.date_echeance AS eche, facture.montant_ht AS montant, facture.date_fact AS dates, facture.statut AS statut, facture.acompte,facture.libre ' +
        'FROM contact, devis, facture ' +
        'WHERE devis.id_contact = contact.id_contact ' +
        'AND devis.id_devis = facture.id_devis ' +
        'UNION  ' +
        'SELECT contact.id_contact AS contact, contact.nom AS nom, facture.id_facture, facture.nfactclient, facture.n_situation, facture.factured, facture.id_devis AS devis, facture.date_echeance AS eche, facture.montant_ht AS montant, facture.date_fact AS dates, facture.statut AS statut, facture.acompte,facture.libre ' +
        'FROM facture ' +
        'LEFT JOIN contact ON facture.id_contact = contact.id_contact ' +
        'WHERE facture.libre IS TRUE ' +
        'ORDER BY nfactclient DESC', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getALLFooter() {
    var deferred = Q.defer();
    db.query('SELECT * FROM agence', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            //console.log(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getAllnfact() {
    var deferred = Q.defer();
    //console.log('ttest');
    db.query('SELECT (COUNT( nfactclient ) +1) AS nfact FROM facture', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

/*------------------------------------Créer facture---------------------------------------------------------------------*/

function getByIdFacture(_id_devis) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT devis.*,contact.nom,contact.raison_sociale, contact.adresse AS cadresse, contact.ville AS cville, contact.code_postal AS ccp FROM devis,contact WHERE id_devis = ? AND contact.id_contact = devis.id_contact";
    var inserts = [_id_devis];

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

function getByIdRetenu(_id_devis) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT pourcentage, nom_chantier FROM chantier,chantierdevis WHERE chantierdevis.id_devis = ? AND chantierdevis.id_chantier=chantier.id_chantier ";
    var inserts = [_id_devis];

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

function getByIdVersion(_id_devis, _num_version) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT * FROM devis_version WHERE id_devis = ? AND num_version = ?";
    var inserts = [_id_devis, _num_version];

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

function getByIdDetail(_id_devis, _num_version) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT * FROM devis_detaille, produit_vente WHERE devis_detaille.id_devis = ? AND devis_detaille.num_version =? AND produit_vente.id_prc = devis_detaille.id_produit AND produit_vente.num_version = devis_detaille.produit_version ";
    var inserts = [_id_devis, _num_version];

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

function getByIdOption(_id_devis, _num_version) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT * FROM devis_option, produit_vente WHERE devis_option.id_devis = ? AND devis_option.num_version =? AND produit_vente.id_prc = devis_option.id_produit AND produit_vente.num_version = devis_option.produit_version AND devis_option.accepted is true";
    var inserts = [_id_devis, _num_version];

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

function getbyIdTotalfact(_id_devis, _num_version) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT ROUND(SUM( qte_devis * prix_devis ),2) as totalht FROM devis_detaille WHERE id_devis =? AND num_version =?";
    var inserts = [_id_devis, _num_version];

    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getbyIdTotalopt(_id_devis, _num_version) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT ROUND(SUM( qte_devis * prix_devis ),2) as totaloption FROM devis_option WHERE id_devis =? AND num_version =? AND devis_option.accepted is true";
    var inserts = [_id_devis, _num_version];

    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function create(facture_param) {
    var deferred = Q.defer();


    db.query("INSERT INTO facture (n_situation, id_devis, id_version,remise,montant_ht,date_fact,date_echeance,nfactclient) VALUES (? , ?, ?,?,?,?,?,? )",
        [facture_param.model.n_situataion ? facture_param.model.n_situation : 1, facture_param.model.id_devis, facture_param.version.num_version, facture_param.version.remise, facture_param.model.montant_ht, facture_param.model.date_fact, facture_param.model.date_echeance, facture_param.nfact.nfact],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            for (var p in facture_param.detail) {
                (function (facture) {
                    db.query("INSERT INTO situation_facture (id_facture, n_situation, id_produit,num_version,pourcentage,qtefact,prixfact,tvas) VALUES (? ,? , ? , ? , ?, ? , ? , ?)",
                        [results.insertId, 1, facture_param.detail[facture].id_produit, facture_param.detail[facture].num_version, facture_param.detail[facture].pourcentage, facture_param.detail[facture].qte_devis, facture_param.detail[facture].prix_devis, facture_param.detail[facture].taux],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.detail.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

            for (var p in facture_param.option) {
                (function (facture) {
                    db.query("INSERT INTO situation_option (id_facture, n_situation, id_produit,num_version,pourcentage,qtefact,prixfact,tvao) VALUES (? , ? , ? , ? , ?, ? , ? , ?)",
                        [results.insertId, 1, facture_param.option[facture].id_produit, facture_param.option[facture].num_version, facture_param.option[facture].pourcentage, facture_param.option[facture].qte_devis, facture_param.option[facture].prix_devis,facture_param.option[facture].taux],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.option.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

            for (var p in facture_param.libre) {
                (function (facture) {
                    db.query("INSERT INTO facture_libredetail (id_fact, n_situation, nom_produit,pourcent,qteprod,prix_prod,tva) VALUES (? , ? , ? , ? , ?, ? , ?  )",
                        [results.insertId, 1, facture_param.libre[facture].produit,  facture_param.libre[facture].pourcentage, facture_param.libre[facture].qte_devis, facture_param.libre[facture].prix_devis,facture_param.libre[facture].taux],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.libre.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

            for (var p in facture_param.libreoption) {
                (function (facture) {
                    db.query("INSERT INTO facture_libredetail (id_fact, n_situation, nom_produit,pourcent,qteprod,prix_prod,option,tva) VALUES (? , ? , ? , ? , ?, ? ,? , ?)",
                        [results.insertId, 1, facture_param.libreoption[facture].produit,  facture_param.libreoption[facture].pourcentage, facture_param.libreoption[facture].qte_devis, facture_param.libreoption[facture].prix_devis,1, facture_param.libreoption[facture].taux],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.libre.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

            db.query("UPDATE devis_version SET `factured` = 1 WHERE id_devis=? AND num_version = ?",
                [facture_param.version.id_devis, facture_param.version.num_version],
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

/*---------------------------------------Modifier facture------------------------------------------------*/

function getByIdModif(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT facture.*,devis.*,chantier.nom_chantier, contact.nom,contact.prenom,contact.raison_sociale,contact.adresse AS cadresse,contact.ville AS cville,contact.code_postal AS ccp " +
        "FROM facture, devis, contact,  chantierdevis, chantier WHERE id_facture =? AND n_situation = ? AND facture.id_devis = devis.id_devis AND devis.id_devis = chantierdevis.id_devis AND chantier.id_chantier = chantierdevis.id_chantier AND contact.id_contact = devis.id_contact  ";
    var inserts = [_id_facture, _n_situation];

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

function getByIdSituation(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT situation_facture.*,produit_vente.libelle,produit_vente.unite FROM situation_facture, produit_vente WHERE situation_facture.id_facture =? AND situation_facture.n_situation =? AND situation_facture.id_produit = produit_vente.id_prc AND produit_vente.num_version = situation_facture.num_version";
    var inserts = [_id_facture, _n_situation];

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

function getByIdSitoption(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT situation_option.*,produit_vente.libelle,produit_vente.unite FROM situation_option, produit_vente WHERE situation_option.id_facture =? AND situation_option.n_situation =? AND situation_option.id_produit = produit_vente.id_prc AND produit_vente.num_version = situation_option.num_version";
    var inserts = [_id_facture, _n_situation];

    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdTotalSit(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT  ROUND(SUM(qtefact * prixfact * pourcentage/100),2) AS totaldet ,n_situation as nsitu FROM situation_facture WHERE situation_facture.id_facture =? AND situation_facture.n_situation =? ";
    var inserts = [_id_facture, _n_situation];

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

function getByIdOptSit(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT  ROUND(SUM(qtefact * prixfact * pourcentage/100),2) AS totalopt  FROM situation_option WHERE situation_option.id_facture =? AND situation_option.n_situation =? ";
    var inserts = [_id_facture, _n_situation];

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

function getByIdValeur(_id_facture) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT  devis_version.*  FROM facture, devis_version WHERE id_facture =? AND facture.id_devis = devis_version.id_devis AND facture.id_version = devis_version.num_version";
    var inserts = [_id_facture];

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

function createSituation(id_facture, facture_param) {
    var deferred = Q.defer();

    db.query("UPDATE facture SET `factured` = 1 WHERE id_facture=? AND n_situation = ?",
        [id_facture, facture_param.model.n_situation],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });


    db.query("Select count(n_situation) as count from facture where id_facture = ?",
        [id_facture],
        function (error, results, fields) {

            var n_situation = results[0].count + 1;


            db.query("INSERT INTO facture (id_facture,n_situation, id_devis, id_version,remise,montant_ht,date_fact,date_echeance,nfactclient) VALUES (? , ?, ?,?,?,?,?,?,? )",
                [id_facture, n_situation, facture_param.model.id_devis, facture_param.model.id_version, facture_param.valeur.remise, facture_param.model.montant_ht, facture_param.model.date_fact, facture_param.model.date_echeance, facture_param.nfact.nfact],
                function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                        console.log(error.name + ': ' + error.message);
                    }

                    for (var p in facture_param.situa) {
                        (function (facture) {
                            db.query("INSERT INTO situation_facture (id_facture, n_situation, id_produit,pourcentage,qtefact,prixfact,num_version) VALUES (? , ? , ? , ?, ? , ?, ? )",
                                [id_facture, n_situation, facture_param.situa[facture].id_produit, facture_param.situa[facture].pourcentage, facture_param.situa[facture].qtefact, facture_param.situa[facture].prixfact, facture_param.situa[facture].num_version],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    }
                                    if (facture = facture_param.situa.length) {
                                        deferred.resolve()
                                    }
                                });
                        })(p);
                    }

                    for (var p in facture_param.option) {

                        (function (facture) {
                            db.query("INSERT INTO situation_option (id_facture, n_situation, id_produit,pourcentage,qtefact,prixfact,num_version) VALUES (? , ? , ? , ?, ? , ?, ? )",
                                [id_facture, n_situation, facture_param.option[facture].id_produit, facture_param.option[facture].pourcentage, facture_param.option[facture].qtefact, facture_param.option[facture].prixfact, facture_param.option[facture].num_version],

                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    }
                                    if (facture = facture_param.option.length) {
                                        deferred.resolve()
                                    }
                                });
                        })(p);
                    }

                    deferred.resolve();

                });


        });


    return deferred.promise;
}

/*------------------------------------liste facture chantier-----------------------------------*/

function getByIdListeFacture(_id_chantier) {
    //console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "SELECT facture.*,chantier.nom_chantier,chantierdevis.date_demarrage,chantierdevis.status FROM devis, chantier, facture,chantierdevis WHERE chantier.id_chantier = ? AND chantier.id_chantier = chantierdevis.id_chantier AND devis.id_devis = chantierdevis.id_devis AND devis.id_devis = facture.id_devis";
    var inserts = [_id_chantier];

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

function getByIdNom(_id_chantier) {
    var deferred = Q.defer();
    var sql = "SELECT nom_chantier, id_chantier FROM chantier WHERE id_chantier =? ";
    var inserts = [_id_chantier];

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

/*----------------------------ajouter facture fournisseur----------------------------------*/

function getAllFournisseur() {
    var deferred = Q.defer();
    //console.log('ttest');
    db.query('SELECT id_contact, nom ' +
        'FROM  `contact` ' +
        'WHERE TYPE =  "fournisseur" ', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getAllBdcdetail() {
    var deferred = Q.defer();
    //console.log('ttest');
    db.query('SELECT bdc_detaille.id_bdc, ROUND( SUM( bdc_detaille.qtelivre * bdc_detaille.prixreel )  , 2 ) AS sumbdc ' +
        'FROM bon_de_commande, bdc_detaille ' +
        'WHERE bon_de_commande.id_bdc = bdc_detaille.id_bdc ' +
        'AND bon_de_commande.recu IS TRUE AND bon_de_commande.rappro IS NOT TRUE ' +
        'GROUP BY bdc_detaille.id_bdc ', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function createfacturefournisseur(facture_param) {
    var deferred = Q.defer();

    db.query("INSERT INTO facture_fournisseur (id_contact, datefourn, n_facture,montantfact) VALUES (? , ?, ?,? )",
        [facture_param.fournisseur.id_contact, facture_param.bdcdet.datefourn, facture_param.bdcdet.n_facture, facture_param.bdcdet.montantfact],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            for (var p in facture_param.list) {
                (function (facture) {
                    db.query("INSERT INTO fournisseur_bdc (id_factfour, id_bdc, montantbdc) VALUES (? ,? , ?  )",
                        [results.insertId, facture_param.list[facture].id_bdc, facture_param.list[facture].sumbdc],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.list.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

            for (var p in facture_param.list) {
                (function (facture) {
                    db.query("UPDATE bon_de_commande SET rappro = ? WHERE id_bdc = ? ",
                        [1, facture_param.list[facture].id_bdc],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.list.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }


        });
    return deferred.promise;
}

/*----------------------------------------------------facture fournisseur----------------------------------*/

function getAllMois(month, year) {
    var deferred = Q.defer();
    console.log('test6');
    db.query('SELECT facture_fournisseur.*,contact.nom ' +
        'FROM facture_fournisseur,contact ' +
        'WHERE (MONTH( facture_fournisseur.datefourn ) =? AND YEAR( facture_fournisseur.datefourn ) =?) ' +
        'AND contact.id_contact= facture_fournisseur.id_contact', [month, year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

/*-----------------------------fournisseur---------------------------------------------*/

function getByIdFournisseur(_id_factfour) {
    var deferred = Q.defer();
    var sql = "SELECT facture_fournisseur.*,contact.nom FROM facture_fournisseur,contact WHERE id_factfour =? AND contact.id_contact= facture_fournisseur.id_contact ";
    var inserts = [_id_factfour];

    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdBDC(_id_factfour) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM fournisseur_bdc WHERE id_factfour =? ";
    var inserts = [_id_factfour];

    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function updateBDC(factureParam) {
    var deferred = Q.defer();

    var params = [
        factureParam.montantbdc,
        factureParam.id_bdc

    ];

    var query = "UPDATE fournisseur_bdc SET montantbdc = ? WHERE  id_bdc = ?  ";
    // console.log(query, params)
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message)
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        console.log(results)

        deferred.resolve();
    });
    return deferred.promise;
}

/*-------------------------------------------------frais generaux mois----------------------------------------*/

function getALLFraiscategorie() {
    var deferred = Q.defer();
    db.query('SELECT * FROM frais_categorie', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            //console.log(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function addfrais(facture_param) {
    var deferred = Q.defer();


    db.query("INSERT INTO fraisgeneraux (designation,categorie, pourcentage,valeur,date_debut,date_fin) VALUES ( ? , ? , ? , ?,?,? )",
        [facture_param.designation, facture_param.categorie, facture_param.pourcentage, facture_param.valeur, facture_param.date_debut, facture_param.date_fin],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });

    return deferred.promise;
}

function getAllFraismois(month, year) {
    var deferred = Q.defer();
    //console.log(month,year);
    db.query('SELECT fraisgeneraux.* FROM fraisgeneraux WHERE ( MONTH(date_debut) =? AND YEAR(date_debut) =? ) ', [month, year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function updateFraismois(facture_param) {
    var deferred = Q.defer();
    //console.log(facture_param.chant);

    var params = [
        facture_param.valeur,
        facture_param.pourcentage,
        facture_param.id_frais

    ];

    var query = "UPDATE fraisgeneraux SET valeur = ?, pourcentage= ? WHERE  id_frais = ?  ";
    console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(+error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        console.log(results)

        deferred.resolve();
    });
    return deferred.promise;
}

function getAllPrev(month, year) {
    var deferred = Q.defer();
    //console.log(month,year);
    db.query('SELECT * FROM fraisprevisionnel WHERE ( MONTH(dateprev) =? AND YEAR(dateprev) =? ) ', [month, year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        console.log(chantier)
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function addprev(facture_param) {
    var deferred = Q.defer();

    //console.log(facture_param);

    db.query("INSERT INTO fraisprevisionnel (montantprev,dateprev) VALUES ( ? , ?  )",
        [facture_param.montantprev, facture_param.dateprev],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });

    return deferred.promise;
}

function deleteFrais(_id_frais) {
    console.log("DELETE FROM fraisgeneraux WHERE id_frais = ? ", [_id_frais]);
    var deferred = Q.defer();
    db.query("DELETE FROM fraisgeneraux WHERE id_frais = ? ", [_id_frais], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}


/*----------------------------------frais généraux annuels---------------------------------*/

function getAllAnnee(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT * ' +
        'FROM listgenerauxmois ' +
        'WHERE  YEAR(date_debut ) =? ORDER BY categorie ASC', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllYprev(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT * ,month(dateprev) AS mois ' +
        'FROM fraisprevisionnel ' +
        'WHERE  YEAR(dateprev ) =? ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

/*----------------------------------balance generale --------------------------------------------*/

function getAlltotalfact(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT *,month(date_fact) AS mois  ' +
        'FROM facture ' +
        'WHERE  YEAR(date_fact) =? ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAlltotaldevis(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT SUM( total ) as Somdevis FROM alldevis WHERE accepted IS TRUE AND YEAR( date_version ) =? ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAlldevisachat(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT devis_detaille.qte_devis, produit_compose.quantite, produit.prix_achat,produit.salaire_charge, produit.id_contact ' +
        'FROM devis_version, devis_detaille, produit_vente, produit_compose, produit ' +
        'WHERE YEAR( date_version ) = ? AND accepted IS TRUE ' +
        'AND (devis_version.id_devis = devis_detaille.id_devis AND devis_version.num_version = devis_detaille.num_version) ' +
        'AND (devis_detaille.id_produit = produit_vente.id_prc AND devis_detaille.produit_version = produit_vente.num_version) ' +
        'AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) ' +
        'AND (produit_compose.id_produit = produit.id_produit AND produit_compose.achat_version = produit.num_version) ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllOptionachat(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT devis_option.qte_devis, produit_compose.quantite, produit.prix_achat, produit.salaire_charge, produit.id_contact ' +
        'FROM devis_version, devis_option, produit_vente, produit_compose, produit ' +
        'WHERE YEAR( devis_version.date_version ) = ? AND devis_version.accepted IS TRUE ' +
        'AND (devis_version.id_devis = devis_option.id_devis AND devis_version.num_version = devis_option.num_version AND devis_option.accepted IS TRUE) ' +
        'AND (devis_option.id_produit = produit_vente.id_prc AND devis_option.produit_version = produit_vente.num_version) ' +
        'AND (produit_vente.id_prc = produit_compose.id_prc AND produit_vente.num_version = produit_compose.num_version) ' +
        'AND (produit_compose.id_produit = produit.id_produit AND produit_compose.achat_version = produit.num_version) ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllFraisan(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT * ' +
        'FROM fraisprevisionnel ' +
        'WHERE YEAR( dateprev ) = ?  ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllMoan(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT travail. * , contrat_histo.tauxsurcharge, contrat_histo.type_contrat ' +
        'FROM travail, contrat_histo, chantierdevis ' +
        'WHERE YEAR( travail.date ) = ? ' +
        'AND contrat_histo.id_contact = travail.id_employé AND travail.valid IS TRUE ' +
        'GROUP BY travail.id_travail  ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllBdcreel(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT * ' +
        'FROM listbdc ' +
        'WHERE annee = ? ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllAnnefrais(year) {
    var deferred = Q.defer();
    //console.log('test6');
    db.query('SELECT * ' +
        'FROM fraismoisannee ' +
        'WHERE annee = ? ', [year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllFraispour() {
    var deferred = Q.defer();
    //console.log('ttest');
    db.query('SELECT * FROM fraispourcentage', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}


/***************************************************************Imprimer facture-----------------------------------------------------------------------------------------*/
function getByIdPrimSit(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT  ROUND(SUM(qtefact * prixfact * pourcentage/100),2) AS totaldet ,n_situation as nsitu FROM situation_facture WHERE situation_facture.id_facture =? AND situation_facture.n_situation <? ";
    var inserts = [_id_facture, _n_situation];

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

function getByIdPrimOpt(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT  ROUND(SUM(qtefact * prixfact * pourcentage/100),2) AS totalopt  FROM situation_option WHERE situation_option.id_facture =? AND situation_option.n_situation <? ";
    var inserts = [_id_facture, _n_situation];

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


function getByIdAccpt(_id_facture, _n_situation) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT devis_version.accompte, devis_version.accompte_value,devis_version.accompte_percent FROM facture " +
        "LEFT JOIN devis_version ON devis_version.id_devis = facture.id_devis AND devis_version.num_version = facture.id_version " +
        "WHERE facture.id_facture =? AND facture.n_situation =? ";
    var inserts = [_id_facture, _n_situation];

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


/**************************************************************AVOIR***********************************************************/

function getAllNavoir() {
    var deferred = Q.defer();
    console.log('avoir');
    db.query('SELECT (COUNT( id_avoir ) +1) AS navoir FROM  avoir', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function addavoir(avoirparams) {
    var deferred = Q.defer();


    db.query("INSERT INTO avoir (id_avoir,id_facture,n_situation,date_avoir,id_contact,tva) VALUES (? ,? , ? , ? , ?, ?)",
        [avoirparams.navoir.navoir, avoirparams.model.id_facture, avoirparams.model.n_situation, avoirparams.model.date_avoir, avoirparams.model.id_contact, avoirparams.valeur.tva], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log("(2)" + error.name + ': ' + error.message);
            }


            for (var p in avoirparams.produitDevis) {
                (function (product) {
                    db.query("INSERT INTO avoir_detail (id_avoir,  id_produit, num_version,  prixfact, qtefact, option) VALUES ( ? , ? , ?, ?, ?, ?)",
                        [
                            avoirparams.navoir.navoir,
                            avoirparams.produitDevis[product].obj.id_produit,
                            avoirparams.produitDevis[product].obj.num_version,
                            avoirparams.produitDevis[product].prixfact,
                            avoirparams.produitDevis[product].qtefact,
                            0
                        ],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (product = avoirparams.produitDevis.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

            for (var p in avoirparams.produitDevisopt) {
                (function (product) {
                    db.query("INSERT INTO avoir_detail (id_avoir,  id_produit, num_version,  prixfact, qtefact, option) VALUES ( ? , ? , ?, ?, ?, ?)",
                        [
                            avoirparams.navoir.navoir,
                            avoirparams.produitDevisopt[product].obj.id_produit,
                            avoirparams.produitDevisopt[product].obj.num_version,
                            avoirparams.produitDevisopt[product].prixfact,
                            avoirparams.produitDevisopt[product].qtefact,
                            1
                        ],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
                            }
                        });
                })(p);
            }


        });
    return deferred.promise;
}

function getAllListavoir() {
    var deferred = Q.defer();
    console.log('avoir');
    db.query('SELECT avoir.id_avoir, avoir.id_facture, avoir.n_situation,avoir.date_avoir, contact.nom, contact.prenom, contact.raison_sociale, SUM( qtefact * prixfact ) AS somme, facture.nfactclient,avoir.montant_ht ' +
        'FROM avoir ' +
        'LEFT JOIN avoir_detail ON avoir_detail.id_avoir = avoir.id_avoir ' +
        'LEFT JOIN contact ON avoir.id_contact = contact.id_contact ' +
        'LEFT JOIN facture ON avoir.id_facture = facture.id_facture ' +
        'AND avoir.n_situation = facture.n_situation ' +
        'GROUP BY id_avoir ' +
        'ORDER BY id_avoir DESC', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdAvoir(_id_avoir) {
    //console.log('facture');
    var deferred = Q.defer();
    var sql = "SELECT facture. * , avoir. * , contact.nom, contact.prenom, contact.adresse, contact.code_postal, contact.ville FROM avoir " +
        "LEFT JOIN facture ON facture.id_facture = avoir.id_facture AND facture.n_situation = avoir.n_situation " +
        "LEFT JOIN contact ON contact.id_contact = avoir.id_contact " +
        "WHERE id_avoir =? ";
    var inserts = [_id_avoir];

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


function getByIdPeodavoir(_id_avoir) {
    var deferred = Q.defer();
    var sql = "SELECT avoir_detail . * , produit_vente.libelle FROM  avoir_detail " +
        "LEFT JOIN produit_vente ON produit_vente.id_prc = avoir_detail.id_produit AND produit_vente.num_version = avoir_detail.num_version " +
        "WHERE id_avoir =?";
    var inserts = [_id_avoir];

    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdPeodavlibre(_id_avoir) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM  avoirlibre WHERE id_avlibre =?";
    var inserts = [_id_avoir];

    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}


function addacompte(facture_param) {
    var deferred = Q.defer();



    db.query("INSERT INTO facture (n_situation, id_devis, id_version,remise,montant_ht,date_fact,date_echeance,nfactclient,acompte) VALUES (? , ?, ?,?,?,?,?,? ,?)",
        [facture_param.model.n_situataion ? facture_param.model.n_situation : 0, facture_param.model.id_devis, facture_param.version.num_version, facture_param.version.remise, facture_param.version.accompte_value, facture_param.model.date_fact, facture_param.model.date_echeance, facture_param.nfact.nfact, 1],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }


            db.query("UPDATE devis_version SET acompte = 1 WHERE id_devis=? AND num_version = ?",
                [facture_param.version.id_devis, facture_param.version.num_version],
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

function getByIdAcopmte(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT COALESCE( SUM( devis_detaille.prix_devis * devis_detaille.qte_devis ) , SUM( devis_detaille_libre.prix_devis * devis_detaille_libre.qte_devis ) ) AS summe FROM facture " +
        "LEFT JOIN devis_detaille ON devis_detaille.id_devis = facture.id_devis AND devis_detaille.num_version = facture.id_version " +
        "LEFT JOIN devis_detaille_libre ON devis_detaille_libre.id_devis = facture.id_devis AND devis_detaille_libre.num_version = facture.id_version " +
        "WHERE facture.id_facture =? AND facture.n_situation =?";
    var inserts = [_id_facture, _n_situation];

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


/**************************************facture  libre*****************************************************************/
function Flibre(facture_param) {
    var deferred = Q.defer();

    console.log(facture_param);


    db.query("INSERT INTO facture (n_situation, montant_ht,date_fact,date_echeance,nfactclient,id_contact,libre,remise) VALUES (? , ?, ?,?,?,?,? ,?)",
        [facture_param.n_situataion ? facture_param.n_situation : 1,  facture_param.devis.montant_ht ? facture_param.devis.montant_ht : facture_param.devis.montant, facture_param.devis.date_fact , facture_param.devis.date_echeance, facture_param.nfact.nfact,facture_param.devis.nomclient.id_contact,1,facture_param.devis.remise],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            for (var p in facture_param.produitDevis) {
                (function (facture) {
                    db.query("INSERT INTO facture_librebase (id_fact, n_situation, id_prod,num_version,prix_fact,qte_fact,pourcent,tva) VALUES (? ,? , ? , ? , ?, ? , ?,? )",
                        [results.insertId, 1, facture_param.produitDevis[facture].obj.id_prc, facture_param.produitDevis[facture].obj.num_version,  facture_param.produitDevis[facture].prix, facture_param.produitDevis[facture].qte, facture_param.produitDevis[facture].pourcent,facture_param.produitDevis[facture].taux],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.produitDevis.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

            for (var p in facture_param.produitFact) {
                (function (facture) {
                    db.query("INSERT INTO facture_libredetail (id_fact, n_situation,nom_produit,qteprod,prix_prod, pourcent,unite,tva) VALUES (? , ? , ? , ?, ? , ?,? ,?)",
                        [results.insertId, 1,  facture_param.produitFact[facture].produit,  facture_param.produitFact[facture].qte_devis, facture_param.produitFact[facture].prix_devis, facture_param.produitFact[facture].pourcentf,facture_param.produitFact[facture].unitef,facture_param.produitFact[facture].tauxf],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (facture = facture_param.produitFact.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }



        });

    return deferred.promise;
}


function getByIdLibreModif(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT facture . * , contact.nom, contact.prenom, contact.raison_sociale, contact.titre, contact.adresse, contact.code_postal, contact.ville, mail.mail, telephone.numero, n_situation +1 as number "+
    "FROM facture "+
    "LEFT JOIN contact ON contact.id_contact = facture.id_contact "+
    "LEFT JOIN mail ON facture.id_contact = mail.id_contact AND mail.type_mail =  'pro' "+
    "LEFT JOIN telephone ON facture.id_contact = telephone.id_contact AND telephone.type_tel ='fax'  "+
    "WHERE facture.id_facture =? AND facture.n_situation =?  ";
    var inserts = [_id_facture, _n_situation];

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

function getByIdLibrebase(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT facture_librebase . * , produit_vente.libelle, produit_vente.unite ,ROUND( (prix_fact * qte_fact * ( pourcent /100 ) * ( tva /100 )),2) AS totaltva " +
        "FROM facture_librebase LEFT JOIN produit_vente ON produit_vente.id_prc = facture_librebase.id_prod " +
        "AND produit_vente.num_version = facture_librebase.num_version WHERE id_fact =? AND n_situation =?";
    var inserts = [_id_facture, _n_situation];

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

function getByIdLibredetail(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT * , ROUND((prix_prod * qteprod * ( pourcent /100 ) * ( tva /100 )),2) AS totaltva , pourcent as pourcentf FROM facture_libredetail " +
        "WHERE id_fact =? AND n_situation =?";
    var inserts = [_id_facture, _n_situation];

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

function getByIdLibresum(_id_facture) {
    var deferred = Q.defer();
    var sql = "SELECT ROUND( SUM( facture.montant_ht ) , 2 ) AS somme FROM facture WHERE id_facture =? ";
    var inserts = [_id_facture];

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


function createSituationlibre(id_facture, facture_param) {
    var deferred = Q.defer();

    db.query("UPDATE facture SET `factured` = 1 WHERE id_facture=? AND n_situation = ?",
        [id_facture, facture_param.model.n_situation],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });


    db.query("Select count(n_situation) as count from facture where id_facture = ?",
        [id_facture],
        function (error, results, fields) {

            var n_situation = results[0].count + 1;


            db.query("INSERT INTO facture (id_facture,n_situation, remise,montant_ht,date_fact,date_echeance,nfactclient,libre,id_contact) VALUES (? , ?, ?,?,?,?,?,?,? )",
                [id_facture, n_situation,  facture_param.model.remise, facture_param.model.situation, facture_param.model.date_fact, facture_param.model.date_echeance, facture_param.nfact.nfact,1,facture_param.model.id_contact],
                function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                        console.log(error.name + ': ' + error.message);
                    }

                    for (var p in facture_param.base) {
                        (function (facture) {
                            db.query("INSERT INTO facture_librebase (id_fact, n_situation, id_prod,pourcent,qte_fact,prix_fact,num_version,tva) VALUES (? , ? , ? , ?, ? , ?, ?,? )",
                                [id_facture, n_situation, facture_param.base[facture].id_prod, facture_param.base[facture].pourcent, facture_param.base[facture].qte_fact, facture_param.base[facture].prix_fact, facture_param.base[facture].num_version,facture_param.base[facture].tva],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    }
                                    if (facture = facture_param.base.length) {
                                        deferred.resolve()
                                    }
                                });
                        })(p);
                    }

                    for (var p in facture_param.detail) {

                        (function (facture) {
                            db.query("INSERT INTO facture_libredetail (id_fact, n_situation,pourcent,qteprod,prix_prod,unite,tva) VALUES (? , ? , ? , ?, ? , ?, ? )",
                                [id_facture, n_situation,  facture_param.detail[facture].pourcentf, facture_param.detail[facture].qteprod, facture_param.detail[facture].prix_prod, facture_param.detail[facture].unite, facture_param.detail[facture].tva],

                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    }
                                    if (facture = facture_param.detail.length) {
                                        deferred.resolve()
                                    }
                                });
                        })(p);
                    }

                    deferred.resolve();

                });


        });


    return deferred.promise;
}

function getByIdLibresumimprim(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT ROUND( SUM( facture.montant_ht ) , 2 ) AS somme FROM facture WHERE id_facture =? and n_situation < ? ";
    var inserts = [_id_facture, _n_situation];

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


function getByIdLibrebaseimprim(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT facture_librebase.tva, ROUND( (prix_fact * qte_fact * ( pourcent /100 ) * ( tva /100 ) * ( 1 - ( facture.remise /100 ) ) ) , 2) AS totaltvab, facture.remise FROM facture_librebase "+
    "LEFT JOIN facture ON facture.id_facture = facture_librebase.id_fact AND facture_librebase.n_situation = facture.n_situation "+
   "WHERE facture_librebase.id_fact =? AND facture_librebase.n_situation = ( ( ? ) -1 ) ";
    var inserts = [_id_facture, _n_situation];

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

function getByIdLibredetailimprim(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT facture_libredetail.tva, ROUND( (prix_prod * qteprod * ( pourcent /100 ) * ( tva /100 ) * ( 1 - ( facture.remise /100 ) ) ) , 2) AS totaltvad FROM facture_libredetail "+
    "LEFT JOIN facture ON facture.id_facture = facture_libredetail.id_fact AND facture_libredetail.n_situation = facture.n_situation "+
    "WHERE facture_libredetail.id_fact =? AND facture_libredetail.n_situation = ( ( ? ) -1 ) ";
    var inserts = [_id_facture, _n_situation];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdAvoirlibre(_id_facture, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT facture_librebase.id_prod, facture_librebase.prix_fact AS prix, facture_librebase.qte_fact AS qte, facture_librebase.tva, produit_vente.libelle AS nom FROM facture_librebase "+
    "LEFT JOIN produit_vente ON produit_vente.id_prc = facture_librebase.id_prod AND produit_vente.num_version = facture_librebase.num_version "+
    "WHERE id_fact =? AND n_situation =? "+
    "UNION "+
    "SELECT id_prod, prix_prod AS prix, qteprod AS qte, tva, nom_produit AS nom FROM facture_libredetail "+
    "WHERE id_fact =? AND n_situation =? ";
    var inserts = [_id_facture, _n_situation,_id_facture, _n_situation];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function addavoirlibre(avoirparams) {
    var deferred = Q.defer();


    db.query("INSERT INTO avoir (id_avoir,id_facture,n_situation,date_avoir,id_contact,libre,montant_ht,remise) VALUES (? ,? , ? , ? , ?, ?,?,?)",
        [avoirparams.navoir.navoir, avoirparams.model.id_facture, avoirparams.model.n_situation, avoirparams.model.date_avoir, avoirparams.model.id_contact, 1,avoirparams.model.montant_ht,avoirparams.remise], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log("(2)" + error.name + ': ' + error.message);
            }


            for (var p in avoirparams.produitDevis) {
                (function (product) {
                    db.query("INSERT INTO avoirlibre (id_avlibre,  nom, tva,  prix, qte ,id_fact, n_situation) VALUES ( ? , ? , ?, ?, ?, ?,?)",
                        [
                            avoirparams.navoir.navoir,
                            avoirparams.produitDevis[product].obj.nom,
                            avoirparams.produitDevis[product].tva,
                            avoirparams.produitDevis[product].prix,
                            avoirparams.produitDevis[product].qte,
                            avoirparams.model.id_facture,
                            avoirparams.model.n_situation
                        ],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            if (product = avoirparams.produitDevis.length) {
                                deferred.resolve()
                            }
                        });
                })(p);
            }

        });
    return deferred.promise;
}

function getByIdDevislibre(_id_devis, _num_version) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM  devis_detaille_libre WHERE id_devis =? AND num_version =?  ";
    var inserts = [_id_devis, _num_version];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdDevislibreoption(_id_devis, _num_version) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM  devis_option_libre WHERE id_devis =? AND num_version =? AND accepted IS TRUE ";
    var inserts = [_id_devis, _num_version];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}


function getByIdlibresituation(_id_fact, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM  facture_libredetail WHERE id_fact =? AND n_situation =? and option IS NOT TRUE ";
    var inserts = [_id_fact, _n_situation];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdlibresituationoption(_id_fact, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM  facture_libredetail WHERE id_fact =? AND n_situation =? and option IS TRUE ";
    var inserts = [_id_fact, _n_situation];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdTotlafact(_id_fact, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT montant_ht FROM  facture WHERE id_facture =? AND n_situation <=? ";
    var inserts = [_id_fact, _n_situation];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdTotlaTVA(_id_fact, _n_situation) {
    var deferred = Q.defer();
    var sql = "SELECT SUM( qtefact * prixfact * ( tvas /100 ) * ( pourcentage /100 ) ) AS somme, tvas AS tva FROM  `situation_facture` " +
        "LEFT JOIN facture ON facture.id_facture = situation_facture.id_facture AND facture.n_situation = situation_facture.n_situation " +
        "WHERE facture.id_facture =? AND facture.n_situation =? " +
        "GROUP BY tvas " +
        "UNION " +
        "SELECT SUM( qtefact * prixfact * ( tvao /100 ) * ( pourcentage /100 ) ) AS somme, tvao AS tva FROM  `situation_option` " +
        "LEFT JOIN facture ON facture.id_facture = situation_option.id_facture AND facture.n_situation = situation_option.n_situation " +
        "WHERE facture.id_facture =? AND facture.n_situation =? " +
        "GROUP BY tvao " +
        "UNION " +
        "SELECT SUM( qteprod * prix_prod * ( tva /100 ) * ( pourcent /100 ) ) AS somme, tva FROM  `facture_libredetail` " +
        "LEFT JOIN facture ON facture.id_facture = facture_libredetail.id_fact AND facture.n_situation = facture_libredetail.n_situation " +
        "WHERE facture.id_facture =? AND facture.n_situation =? " +
        "GROUP BY tva ";
    var inserts = [_id_fact, _n_situation,_id_fact, _n_situation,_id_fact, _n_situation];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}