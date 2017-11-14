/**
 * Created by Wbat on 04/07/2017.
 */
/**
 * Created by Alexandre on 08/06/2017.
 */
var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var db = require('../db.js').get();


var service = {};

service.getAll = getAll;
service.getAllDate = getAllDate;
service.getById = getById;
service.getAllProducts = getAllProducts;
service.createLibre = createLibre;
service.create = create;
service.delete = _delete;
service.update = update;
service.validate = validate;
service.modify = modify;
service.modifylibre = modifylibre;
service.envoye = envoye;
service.duplicate = duplicate;
service.acceptoffer = acceptoffer;
service.getLogo = getLogo;

/*-----------devis libre--------------------*/
service.getAllTVA =getAllTVA;

/*-------------Analyse devis----------------*/
service.getByIdAnalyse = getByIdAnalyse;
service.getByIdAnalyseopt = getByIdAnalyseopt;
service.updateDevisdetail = updateDevisdetail;
service.updateDevisoption = updateDevisoption;

service.getByIdAnaldevis = getByIdAnaldevis;
service.getByIdLibre = getByIdLibre;
service.getByIdLibreproduit = getByIdLibreproduit;
service.offerlibre = offerlibre;

service.getByIddupliquer=getByIddupliquer;
service.duplicatelibre = duplicatelibre;


module.exports = service;

function validate(devisParam) {
    var deferred = Q.defer();

    db.query("INSERT INTO chantierdevis (id_chantier, id_devis, num_version) VALUES (? , ? , ?  )",
        [devisParam.id_chantier , devisParam.id_devis ,devisParam.num_version ],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });

    db.query("UPDATE devis_version SET `accepted` = 1 WHERE id_devis=? AND num_version = ?",
        [devisParam.id_devis ,devisParam.num_version ],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });

    db.query("UPDATE devis SET `valide` = 1 WHERE id_devis= ? ",
        [devisParam.id_devis ],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });
    return deferred.promise;
}


function modify(devis_params, id, num_version) {
    var deferred = Q.defer();
    console.log(devis_params);
    console.log(id);
    console.log(num_version);
    //set devis, supprimer devis_detaille et option et rajouter derrière
    db.query( "UPDATE devis_version SET tva = ?, remise = ?, accompte = ?, accompte_value = ?, accompte_percent = ?, statut = 'Modifié' WHERE id_devis = ? && num_version = ?",
        [devis_params.devis.tva, devis_params.devis.remise, devis_params.devis.accompte, devis_params.devis.accompte_value, devis_params.devis.accompte_percent, id, num_version], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);



            db.query("DELETE FROM devis_detaille WHERE id_devis = ? && num_version = ?", [id, num_version], function (error, results, fields) {
                if (error) deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log("slt1");
                    for (var p in devis_params.produitDevis) {
                        (function (product) {

                            console.log("slt");

                            //console.log("INSERT INTO devis_detaille (id_devis, num_version, id_produit, qte_devis, prix_devis) VALUES (? , ? , ? , ?, ?)",
                            //   [id_devis,num_version , devis_params.produitDevis[product].id_prc , devis_params.produitDevis[product].qte_devis , devis_params.produitDevis[product].prix_devis ]);


                            db.query("INSERT INTO devis_detaille (id_devis, num_version, id_produit, produit_version, qte_devis, prix_devis) VALUES (? , ? , ? , ? , ?, ?)",
                                [id,
                                    num_version,
                                    devis_params.produitDevis[product].id_prc,
                                    devis_params.produitDevis[product].num_version,
                                    devis_params.produitDevis[product].qte_devis,
                                    devis_params.produitDevis[product].prix_devis],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    }
                                    console.log(product , devis_params.produitDevis.length);
                                    if (product = devis_params.produitDevis.length) {
                                        deferred.resolve();
                                    }
                                });
                        })(p);
                    }



            });


            db.query("DELETE FROM devis_option WHERE id_devis = ? && num_version = ?", [id, num_version], function (error, results, fields) {
                if (error) deferred.reject('MySql ERROR trying to update user informations (2) | '+ error.message);

                    for (var p in devis_params.produitDevisOptions) {
                        (function (product) {

                            db.query("INSERT INTO devis_option (id_devis, num_version, id_produit, produit_version, qte_devis, prix_devis) VALUES (? , ? , ? , ? , ?, ?)",
                                [id,
                                    num_version,
                                    devis_params.produitDevisOptions[product].id_prc,
                                    devis_params.produitDevisOptions[product].num_version,
                                    devis_params.produitDevisOptions[product].qte_devis,
                                    devis_params.produitDevisOptions[product].prix_devis
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
        });

    return deferred.promise;
}


function envoye(id, num_version) {
    var deferred = Q.defer();

    db.query("UPDATE devis_version SET `statut` = 'Envoyé' , envoye = 1 WHERE id_devis= ?  && num_version = ?",
        [id, num_version],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });


    return deferred.promise;
}

function acceptoffer( offerparams) {
    var deferred = Q.defer();

    console.log("UPDATE devis_option SET accepted = ?  WHERE id_devis= ?  && num_version = ? && id_produit = ? && produit_version = ?",
        [offerparams.accepted, offerparams.id_devis, offerparams.num_version, offerparams.id_produit, offerparams.produit_version])
    db.query("UPDATE devis_option SET accepted = ?  WHERE id_devis= ?  && num_version = ? && id_produit = ? && produit_version = ?",
        [offerparams.accepted, offerparams.id_devis, offerparams.num_version, offerparams.id_produit, offerparams.produit_version],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });


    return deferred.promise;
}

function update(_id, bdcParam) {
    var deferred = Q.defer();

    deferred.resolve();

    return deferred.promise;
}

function getAllProducts(_id) {
    var deferred = Q.defer();
    db.query('SELECT * FROM bdc_detaille ' +
        'INNER JOIN produit on bdc_detaille.id_produit = produit.id_produit where id_bdc = ?', [_id], function (error, prods, fields) {

        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(prods);
    });
    return deferred.promise;
}

function getAllDate() {
    var deferred = Q.defer();
    db.query('SELECT * FROM alldevis ' +
        'LEFT JOIN devis on devis.id_devis = alldevis.id_devis ' +
        'LEFT JOIN contact on devis.id_contact = contact.id_contact' ,
        function (error, chantiers, fields) {

            if (error) {
                console.log(error.name + ': ' + error.message)
                deferred.reject(error.name + ': ' + error.message);
            }

            deferred.resolve(chantiers);
        });
    return deferred.promise;
}


function getAll(month, year) {
    var deferred = Q.defer();
    db.query('SELECT * FROM alldevis ' +
        'LEFT JOIN devis on devis.id_devis = alldevis.id_devis ' +
        'LEFT JOIN contact on devis.id_contact = contact.id_contact' +
        ' WHERE MONTH(date_version) = ? && YEAR(date_version)= ? ',
        [month, year], function (error, chantiers, fields) {

            if (error) {
                console.log(error.name + ': ' + error.message)
                deferred.reject(error.name + ': ' + error.message);
            }

            deferred.resolve(chantiers);
        });
    return deferred.promise;
}

function getById(_id, num_version) {
    var deferred = Q.defer();
    var sql = "SELECT * from devis_version " +
        "left join devis on devis.id_devis = devis_version.id_devis " +
        "left join contact on contact.id_contact = devis.id_contact " +
        //"left join chantier on chantier.id_chantier = devis.id_chantier " +
        "WHERE devis_version.id_devis = ? and num_version = ?";
    var inserts = [_id, num_version];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, devis, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log("Error in first select : " +error.name + ': ' + error.message);
        }
        else {
            var sql = "SELECT * from devis_detaille " +
                "left join produit_vente on produit_vente.id_prc = devis_detaille.id_produit && produit_vente.num_version = devis_detaille.produit_version " +
                "WHERE id_devis = ? and devis_detaille.num_version = ? ";
            var inserts = [_id, num_version];
            sql = mysql.format(sql, inserts);
            db.query(sql, function (error, detaille, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                    console.log(error.name + ': ' + error.message);
                }
                var sql = "SELECT * , devis_option.num_version as num_version from devis_option " +
                    "left join produit_vente on produit_vente.id_prc = devis_option.id_produit && produit_vente.num_version = devis_option.produit_version " +
                    "WHERE id_devis = ? and devis_option.num_version = ?";
                var inserts = [_id, num_version];

                sql = mysql.format(sql, inserts);
                console.log(sql)
                db.query(sql, function (error, option, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                        console.log(error.name + ': ' + error.message);
                    }
                    console.log(option);
                    var tmp = {};
                    tmp.devis = devis;
                    tmp.detaille = detaille;
                    tmp.options = option;
                    //console.log(tmp);
                    deferred.resolve(tmp);
                });
            });


        }

    });
    return deferred.promise;

}


function duplicate(id_devis, devis_params) {
    //console.log(devis_params);
    //console.log(id_devis);



    var deferred = Q.defer();

    db.query("Select count(num_version) as count from devis_version where id_devis = ?",
        [id_devis],
        function (error, results, fields) {

            var num_version = results[0].count + 1;

            //console.log("INSERT INTO devis_version (id_devis, num_version, accompte, accompte_value, accompte_percent, accepted , date_version, statut, tva) VALUES ( ? , ? , ? , ?, ?, ?, NOW(), ?, ? )",
            //[id_devis,num_version, devis_params.devis.accompte, devis_params.devis.accompte_value, devis_params.devis.accompte_percent, false, "Dupliqué", devis_params.devis.tva, +id_devis]);

            db.query("INSERT INTO devis_version (id_devis, num_version, accompte, accompte_value, accompte_percent, accepted , date_version, statut, tva, remise)" +
                " VALUES ( ? , ? , ? , ?, ?, ?, NOW(), ?, ?, ? )",
                [   id_devis,
                    num_version,
                    devis_params.devis.accompte,
                    devis_params.devis.accompte_value,
                    devis_params.devis.accompte_percent,
                    false,
                    "Dupliqué",
                    devis_params.devis.tva,
                    devis_params.devis.remise,
                ],
                function (error, result, fields) {
                    if (error) {
                        deferred.reject("devis version:" + error.name + ': ' + error.message);
                        console.log(error.name + ': ' + error.message);
                    }


                    for (var p in devis_params.produitDevis) {
                        (function (product) {

                            //console.log("INSERT INTO devis_detaille (id_devis, num_version, id_produit, qte_devis, prix_devis) VALUES (? , ? , ? , ?, ?)",
                            //    [id_devis,num_version , devis_params.produitDevis[product].id_prc , devis_params.produitDevis[product].qte_devis , devis_params.produitDevis[product].prix_devis ]);


                            db.query("INSERT INTO devis_detaille (id_devis, num_version, id_produit, produit_version, qte_devis, prix_devis) VALUES (? , ? , ? , ? , ?, ?)",
                                [   id_devis,
                                    num_version,
                                    devis_params.produitDevis[product].id_prc,
                                    devis_params.produitDevis[product].num_version,
                                    devis_params.produitDevis[product].qte_devis,
                                    devis_params.produitDevis[product].prix_devis],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    }
                                    if (product = devis_params.produitDevis.length) {
                                        deferred.resolve();
                                    }
                                });
                        })(p);
                    }

                    for (var p in devis_params.produitDevisOptions) {
                        (function (product) {

                            //console.log("INSERT INTO devis_option (id_devis, num_version, id_produit, qte_devis, prix_devis) VALUES (? , ? , ? , ?, ?)",
                            // [id_devis, num_version, devis_params.produitDevisOptions[product].id_prc , devis_params.produitDevisOptions[product].qte_devis , devis_params.produitDevisOptions[product].prix_devis ]);

                            db.query("INSERT INTO devis_option (id_devis, num_version, id_produit, produit_version, qte_devis, prix_devis) VALUES (? , ? , ? , ? , ?, ?)",
                                [   id_devis,
                                    num_version,
                                    devis_params.produitDevisOptions[product].id_prc,
                                    devis_params.produitDevisOptions[product].num_version,
                                    devis_params.produitDevisOptions[product].qte_devis,
                                    devis_params.produitDevisOptions[product].prix_devis
                                ],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
                                    }
                                });
                        })(p);
                    }


                    deferred.resolve();
                });


        });

    return deferred.promise;
}

function createLibre(bdc_param){
    var deferred = Q.defer();
    console.log(bdc_param);

    db.query("INSERT INTO devis (id_contact, nom_chantier, adresse, cp, ville, libre) VALUES (? , ? , ?, ?, ?, ?)", [bdc_param.devis.nomclient.id_contact, bdc_param.devis.chantier , bdc_param.devis.address, bdc_param.devis.cp, bdc_param.devis.ville, 1], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log("(2)"+error.name + ': ' + error.message);
            }
        db.query("INSERT INTO devis_version (id_devis, num_version, accompte, accompte_value, accompte_percent, accepted , date_version, statut, tva, remise,montantht,offre,designation, libre)" +
            " VALUES (? , ? , ? , ?, ?, ?, ?, ?, ?,?,?,?,?,?)",
            [results.insertId, 1, bdc_param.devis.accompte, bdc_param.devis.accompteeuros, bdc_param.devis.accomptepercentage, false, new Date(), "Créé", bdc_param.devis.tva, bdc_param.devis.remise,bdc_param.devis.montantht,bdc_param.devis.offre,bdc_param.devis.designation, 1],
            function (error, result, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                    console.log("(1)"+error.name + ': ' + error.message);
                }

                for (var p in bdc_param.produitDevis) {
                    (function (product) {
                        db.query("INSERT INTO devis_detaille_libre (id_devis, num_version, produit, qte_devis, prix_devis,commentaire, unite) VALUES (? ,?, ?, ?, ?,?, ?)",
                            [   results.insertId,
                                1,
                                bdc_param.produitDevis[product].obj,
                                bdc_param.produitDevis[product].qte,
                                bdc_param.produitDevis[product].prix,
                                bdc_param.produitDevis[product].commentaire,
                                bdc_param.produitDevis[product].unite

                            ],
                            function (error, result, fields) {
                                if (error) {
                                    deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                }
                                if (product = bdc_param.produitDevis.length) {
                                    deferred.resolve()
                                }
                            });
                    })(p);
                }

                for (var p in bdc_param.produitDevisOptions) {
                    (function (product) {
                        db.query("INSERT INTO devis_option_libre (id_devis, num_version, produit, qte_devis, prix_devis,commentaire, unite) VALUES (?, ? ,?, ?, ?, ? ,?)",
                            [results.insertId,
                                1,
                                bdc_param.produitDevisOptions[product].obj,
                                bdc_param.produitDevisOptions[product].qte,
                                bdc_param.produitDevisOptions[product].prix,
                                bdc_param.produitDevisOptions[product].commentaire,
                                bdc_param.produitDevisOptions[product].unite
                            ],
                            function (error, result, fields) {
                                if (error) {
                                    deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
                                    console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
                                }
                            });
                    })(p);
                }
            //deferred.resolve(devis);
        });
    });
    return deferred.promise;
}

function create(bdc_param) {
    var deferred = Q.defer();
    /*console.log(bdc_param.devis);
     console.log(bdc_param.produitDevis);
     console.log(bdc_param.produitDevisOptions);*/

    db.query("INSERT INTO devis (id_contact, id_chantier, nom_chantier, adresse, cp, ville) VALUES (? , ? , ? , ?, ?, ?)", [bdc_param.devis.nomclient.id_contact,  bdc_param.devis.id_chantier ,bdc_param.devis.nom_chantier , bdc_param.devis.address, bdc_param.devis.cp, bdc_param.devis.ville], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log("(2)"+error.name + ': ' + error.message);
        }


        db.query("INSERT INTO devis_version (id_devis, num_version, accompte, accompte_value, accompte_percent, accepted , date_version, statut, tva, remise,montantht,offre,designation)" +
            " VALUES (? , ? , ? , ?, ?, ?, ?, ?, ?,?,?,?,? )",
            [results.insertId, 1, bdc_param.devis.accompte, bdc_param.devis.accompteeuros, bdc_param.devis.accomptepercentage, false, new Date(), "Créé", bdc_param.devis.tva, bdc_param.devis.remise,bdc_param.devis.montantht,bdc_param.devis.offre,bdc_param.devis.designation],
            function (error, result, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                    console.log("(1)"+error.name + ': ' + error.message);
                }


                for (var p in bdc_param.produitDevis) {
                    (function (product) {
                        db.query("INSERT INTO devis_detaille (id_devis, num_version, id_produit, produit_version, qte_devis, prix_devis,commentaire) VALUES (? , ? , ? , ?, ?, ?,?)",
                            [   results.insertId,
                                1,
                                bdc_param.produitDevis[product].obj.id_prc,
                                bdc_param.produitDevis[product].obj.num_version ,
                                bdc_param.produitDevis[product].qte,
                                bdc_param.produitDevis[product].prix,
                                bdc_param.produitDevis[product].commentaire
                            ],
                            function (error, result, fields) {
                                if (error) {
                                    deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                }
                                if (product = bdc_param.produitDevis.length) {
                                    deferred.resolve()
                                }
                            });
                    })(p);
                }

                for (var p in bdc_param.produitDevisOptions) {
                    (function (product) {
                        db.query("INSERT INTO devis_option (id_devis, num_version, id_produit, produit_version, qte_devis, prix_devis,commentaire) VALUES (? , ? , ? , ?, ?, ? ,?)",
                            [results.insertId,
                                1,
                                bdc_param.produitDevisOptions[product].obj.id_prc,
                                bdc_param.produitDevisOptions[product].obj.num_version,
                                bdc_param.produitDevisOptions[product].qte,
                                bdc_param.produitDevisOptions[product].prix,
                                bdc_param.produitDevisOptions[product].commentaire
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
    });
    return deferred.promise;
}


function _delete(_id) {
    var deferred = Q.defer();
    db.query("DELETE FROM bon_de_commande WHERE id_bdc = ? ", [_id], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve();
    });
    return deferred.promise;
}

/*------------------------------------------devis libre----------------------------------------------------*/

function getAllTVA() {
    var deferred = Q.defer();
    db.query('SELECT * FROM tva ' ,
        function (error, chantiers, fields) {

            if (error) {
                console.log(error.name + ': ' + error.message)
                deferred.reject(error.name + ': ' + error.message);
            }

            deferred.resolve(chantiers);
        });
    return deferred.promise;
}

/*---------------------------------------------------------Analyse Devis----------------------------------------------*/
function getByIdAnalyse(_id_devis,_num_version) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "SELECT devis_detaille. *, produit_vente . * FROM devis_version, devis_detaille, produit_vente " +
        "WHERE devis_version.id_devis = ? AND devis_version.num_version = ? " +
        "AND (devis_version.id_devis = devis_detaille.id_devis AND devis_version.num_version = devis_detaille.num_version) " +
        "AND (produit_vente.id_prc = devis_detaille.id_produit AND produit_vente.num_version = devis_detaille.num_version)";
    var inserts = [_id_devis,_num_version];

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

function getByIdAnalyseopt(_id_devis,_num_version) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "SELECT devis_option. *, produit_vente . * FROM devis_version, devis_option, produit_vente " +
        "WHERE devis_version.id_devis = ? AND devis_version.num_version = ? " +
        "AND (devis_version.id_devis = devis_option.id_devis AND devis_version.num_version = devis_option.num_version) " +
        "AND (produit_vente.id_prc = devis_option.id_produit AND produit_vente.num_version = devis_option.num_version)";
    var inserts = [_id_devis,_num_version];

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

function updateDevisdetail(devisParam) {
    console.log("update chantier devis service server");
    console.log(devisParam);
    var deferred = Q.defer();

    var params = [
        devisParam.prix_dev,
        devisParam.margedev ? devisParam.margedev : devisParam.margepc,
        devisParam.id_produit,
        devisParam.id_devis,
        devisParam.num_version


    ];

    var query = "UPDATE devis_detaille SET prix_devis=?,margedev=? WHERE id_produit= ? AND id_devis = ? AND num_version =? ";
    console.log(query, params);
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

function updateDevisoption(devisParam) {
    //console.log("update chantier devis service server");
    //console.log(devisParam);
    var deferred = Q.defer();

    var params = [
        devisParam.prix_dev,
        devisParam.margedev ? devisParam.margedev : devisParam.margepc,
        devisParam.id_produit,
        devisParam.id_devis,
        devisParam.num_version


    ];

    var query = "UPDATE devis_option SET prix_devis=?,margedev=? WHERE id_produit= ? AND id_devis = ? AND num_version =? ";
    //console.log(query, params);
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


function getLogo(id_param_ged) {
    var deferred = Q.defer();
    db.query('SELECT * FROM param_ged ' , [id_param_ged], function (error, prods, fields) {

        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(prods);
    });
    return deferred.promise;
}

function getByIdAnaldevis(_id_devis,_num_version) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "SELECT accepted FROM devis_version WHERE id_devis =? AND num_version = ?";
    var inserts = [_id_devis,_num_version];

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

function getByIdLibre(_id_devis,_num_version) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "SELECT devis.adresse AS ad, devis.cp, devis.ville AS vil ,devis.nom_chantier, devis_version.* , contact.nom, contact.prenom, contact.raison_sociale, contact.adresse, contact.code_postal, contact.ville FROM contact, devis_version " +
        "LEFT JOIN devis ON devis.id_devis = devis_version.id_devis WHERE (devis_version.id_devis = ? AND devis_version.num_version = ?) AND devis.id_contact = contact.id_contact";
    var inserts = [_id_devis,_num_version];

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

function getByIdLibreproduit(_id_devis,_num_version) {
    //console.log('test fact')
    // console.log(error.name + ': ' + error.message);
    var deferred = Q.defer();
    var sql = "select devis_detaille_libre.* FROM devis_version, devis_detaille_libre " +
        "WHERE ((devis_detaille_libre.id_devis = devis_version.id_devis and devis_detaille_libre.num_version = devis_version.num_version) ) AND devis_version.id_devis = ? and devis_version.num_version =? " +
        "UNION select devis_option_libre.* FROM devis_version, devis_option_libre " +
        "WHERE ( devis_option_libre.id_devis = devis_version.id_devis and devis_option_libre.num_version = devis_version.num_version) AND devis_version.id_devis = ? and devis_version.num_version =?";
    var inserts = [_id_devis,_num_version,_id_devis,_num_version];

    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error){
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function offerlibre(offerparams) {
    var deferred = Q.defer();
   //console.log(offerparams);
    db.query("UPDATE devis_option_libre SET accepted = ?  WHERE id_devis= ?  && num_version = ? && id_produit = ?",
        [offerparams.accepted, offerparams.id_devis, offerparams.num_version, offerparams.id_produit],
        function (error, result, fields) {
            if (error) {
                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
            }
            deferred.resolve()

        });


    return deferred.promise;
}

function getByIddupliquer(id_devis, num_version) {
    var deferred = Q.defer();
    var sql = "SELECT devis_version . * , devis . * , contact.nom, contact.prenom, contact.raison_sociale, contact.adresse AS adr, contact.code_postal, contact.ville AS vil from devis_version " +
        "left join devis on devis.id_devis = devis_version.id_devis " +
        "left join contact on contact.id_contact = devis.id_contact " +
        "WHERE devis_version.id_devis = ? and num_version = ?";
    var inserts = [id_devis, num_version];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, devis, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log("Error in first select : " +error.name + ': ' + error.message);
        }
        else {
            var sql = "SELECT *,devis_detaille_libre.qte_devis as qte, devis_detaille_libre.prix_devis as qte from devis_detaille_libre " +
                "left join devis_version on devis_detaille_libre.id_devis && devis_version.num_version = devis_detaille_libre.num_version " +
                "WHERE devis_detaille_libre.id_devis = ? and devis_detaille_libre.num_version = ? GROUP BY devis_detaille_libre.id_produit";
            var inserts = [id_devis, num_version];
            sql = mysql.format(sql, inserts);
            db.query(sql, function (error, detaille, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                    console.log(error.name + ': ' + error.message);
                }
                var sql = "SELECT * , devis_option_libre.num_version as num_version from devis_option_libre " +
                    "left join devis_version on devis_version.id_devis = devis_option_libre.id_devis && devis_version.num_version = devis_option_libre.num_version " +
                    "WHERE devis_option_libre.id_devis = ? and devis_option_libre.num_version = ? GROUP BY devis_option_libre.id_produit";
                var inserts = [id_devis, num_version];

                sql = mysql.format(sql, inserts);
                console.log(sql)
                db.query(sql, function (error, option, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                        console.log(error.name + ': ' + error.message);
                    }
                    console.log(option);
                    var tmp = {};
                    tmp.devis = devis;
                    tmp.detaille = detaille;
                    tmp.options = option;
                    //console.log(tmp);
                    deferred.resolve(tmp);
                });
            });


        }

    });
    return deferred.promise;

}

function duplicatelibre(id_devis, devis_params) {
    console.log(devis_params);
    //console.log(id_devis);



    var deferred = Q.defer();

    db.query("Select count(num_version) as count from devis_version where id_devis = ?",
        [id_devis],
        function (error, results, fields) {

            var num_version = results[0].count + 1;

            //console.log("INSERT INTO devis_version (id_devis, num_version, accompte, accompte_value, accompte_percent, accepted , date_version, statut, tva) VALUES ( ? , ? , ? , ?, ?, ?, NOW(), ?, ? )",
            //[id_devis,num_version, devis_params.devis.accompte, devis_params.devis.accompte_value, devis_params.devis.accompte_percent, false, "Dupliqué", devis_params.devis.tva, +id_devis]);

            db.query("INSERT INTO devis_version (id_devis, num_version, accompte, accompte_value, accompte_percent, accepted , date_version, statut, tva, remise)" +
                " VALUES ( ? , ? , ? , ?, ?, ?, NOW(), ?, ?, ? )",
                [   id_devis,
                    num_version,
                    devis_params.devis.accompte,
                    devis_params.devis.accompte_value,
                    devis_params.devis.accompte_percent,
                    false,
                    "Dupliqué",
                    devis_params.devis.tva,
                    devis_params.devis.remise,
                ],
                function (error, result, fields) {
                    if (error) {
                        deferred.reject("devis version:" + error.name + ': ' + error.message);
                        console.log(error.name + ': ' + error.message);
                    }


                    for (var p in devis_params.produitDevis) {
                        (function (product) {


                            db.query("INSERT INTO devis_detaille_libre (id_devis,num_version, produit,qte_devis, prix_devis,commentaire,unite) VALUES (? , ?, ? , ? , ? , ?, ?)",
                                [   id_devis,
                                    num_version,
                                    devis_params.produitDevis[product].produit,
                                    devis_params.produitDevis[product].qte_devis,
                                    devis_params.produitDevis[product].prix_devis,
                                    devis_params.produitDevis[product].commentaire,
                                    devis_params.produitDevis[product].unite
                                ],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    }
                                    if (product = devis_params.produitDevis.length) {
                                        deferred.resolve();
                                    }
                                });
                        })(p);
                    }

                    for (var p in devis_params.produitDevisOptions) {
                        (function (product) {


                            db.query("INSERT INTO devis_option_libre (id_devis, num_version,produit, qte_devis, prix_devis,commentaire, unite) VALUES (?, ? , ? , ? , ? , ?, ?)",
                                [   id_devis,
                                    num_version,
                                    devis_params.produitDevisOptions[product].produit,
                                    devis_params.produitDevisOptions[product].qte_devis,
                                    devis_params.produitDevisOptions[product].prix_devis,
                                    devis_params.produitDevisOptions[product].commentaire,
                                    devis_params.produitDevisOptions[product].unite
                                ],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
                                        console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
                                    }
                                });
                        })(p);
                    }


                    deferred.resolve();
                });


        });

    return deferred.promise;
}

function modifylibre(devis_params, id_devis, num_version) {
    var deferred = Q.defer();
    //set devis, supprimer devis_detaille et option et rajouter derrière
    db.query( "UPDATE devis_version SET tva = ?, remise = ?, accompte = ?, accompte_value = ?, accompte_percent = ?, statut = 'Modifié' WHERE id_devis = ? && num_version = ?",
        [devis_params.devis.tva, devis_params.devis.remise, devis_params.devis.accompte, devis_params.devis.accompte_value, devis_params.devis.accompte_percent, id_devis, num_version], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);

            db.query("DELETE FROM devis_detaille_libre WHERE id_devis = ? && num_version = ?", [id_devis, num_version], function (error, results, fields) {
                if (error) deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                for (var p in devis_params.produitDevis) {
                    (function (product) {

                        db.query("INSERT INTO devis_detaille_libre (id_devis, num_version, produit, qte_devis, prix_devis, commentaire, unite) VALUES (?, ? , ? , ? , ? , ?, ?)",
                            [id_devis,
                                num_version,
                                devis_params.produitDevis[product].produit,
                                devis_params.produitDevis[product].qte_devis,
                                devis_params.produitDevis[product].prix_devis,
                                devis_params.produitDevis[product].commentaire,
                                devis_params.produitDevis[product].unite
                            ],
                            function (error, result, fields) {
                                if (error) {
                                    deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                                    console.log('MySql ERROR trying to update user informations (2) | ' + error.message);
                                }
                                console.log(product , devis_params.produitDevis.length);
                                if (product = devis_params.produitDevis.length) {
                                    deferred.resolve();
                                }
                            });
                    })(p);
                }
            });
            db.query("DELETE FROM devis_option_libre WHERE id_devis = ? && num_version = ?", [id_devis, num_version], function (error, results, fields) {
                if (error) deferred.reject('MySql ERROR trying to update user informations (2) | '+ error.message);
                for (var p in devis_params.produitDevisOptions) {
                    (function (product) {

                        db.query("INSERT INTO devis_option_libre (id_devis, num_version, produit, qte_devis, prix_devis, commentaire, unite) VALUES (?, ? , ? , ? , ? , ?, ?)",
                            [id_devis,
                                num_version,
                                devis_params.produitDevisOptions[product].produit,
                                devis_params.produitDevisOptions[product].qte_devis,
                                devis_params.produitDevisOptions[product].prix_devis,
                                devis_params.produitDevisOptions[product].commentaire,
                                devis_params.produitDevisOptions[product].unite
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
        });
    return deferred.promise;
}
