/**
 * Created by Alexandre on 08/06/2017.
 */
var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var service = {};

service.getAll = getAll;
service.getAllDate = getAllDate;
service.getById = getById;
service.getAllProducts = getAllProducts;
service.getAllibre = getAllibre;
service.getAllImprevuProducts = getAllImprevuProducts;
service.create = create;
service.delete = _delete;
service.update = update;
service.validate = validate;
service.changeState = changeState;
service.demandes = demandes;
service.getAllListing = getAllListing;
service.getByIdDetail = getByIdDetail;

module.exports = service;


function changeState(_id, bdcParam) {
    var deferred = Q.defer();
    //console.log("state change" + bdcParam.state, _id);
    db.query("UPDATE bon_de_commande SET state = ? WHERE id_bdc = ?",
        [bdcParam.state, _id], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | ' + error.message);
            deferred.resolve();
        });

    return deferred.promise;
}

function validate(_id, bdcParam) {
    var deferred = Q.defer();

    db.query("SELECT * FROM bon_de_commande WHERE id_bdc= ?", [_id], function (error, results, fields) {
        if (error) deferred.reject('MySql ERROR trying to update user informations (1) | ' + error.message);

        if (results.length > 0) {
            validateBDC();
        }
    });

    function validateBDC() {

        db.query("UPDATE bon_de_commande SET date_livraison_reel = ?,  recu = ?, tarifpourlivraisonreel = ? WHERE id_bdc = ?",
            [new Date(bdcParam.date_livraison), true, bdcParam.livraison, _id], function (error, results, fields) {
                if (error) {
                    console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
                    deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
                }

                //ajouter tout les produits

                for (var p in bdcParam.list) {

                    (function (product) {


                        db.query("UPDATE bdc_detaille SET Prixreel = ?, Qtelivre = ? WHERE id_bdc = ? AND id_produit = ? AND num_version= ?",
                            [bdcParam.list[product].Prixreel, bdcParam.list[product].Qtelivre, _id, bdcParam.list[product].id_produit, bdcParam.list[product].num_version],
                            function (error, result, fields) {
                                if (error) {
                                    console.log('MySql ERROR trying to update user informations (2) | in adding products ' + error.message);
                                    deferred.reject('MySql ERROR trying to update user informations (2) | in adding products ' + error.message);
                                    return;
                                }

                                deferred.resolve();
                                //console.log(result.insertId);
                                //console.log(result.insertId);
                            });
                    })(p);

                }

                console.log(bdcParam.listimprevu);
                for (var p in bdcParam.listimprevu) {

                    (function (product) {

                        console.log("INSERT INTO bdc_imprevu (id_bdc, reference, libelle, unite, Prixreel, Qtelivre, id_produit, num_version) VALUES (? , ? , ? , ?, ?, ? , ?, ?)",
                            [_id, bdcParam.listimprevu[product].reference, bdcParam.listimprevu[product].libelle.libelle ? bdcParam.listimprevu[product].libelle.libelle : bdcParam.listimprevu[product].libelle,
                                bdcParam.listimprevu[product].unite, bdcParam.listimprevu[product].Prixreel,
                                bdcParam.listimprevu[product].Qtelivre, bdcParam.listimprevu[product].libelle.id_produit,
                                bdcParam.listimprevu[product].libelle.num_version]);
                        db.query("INSERT INTO bdc_imprevu (id_bdc, reference, libelle, unite, Prixreel, Qtelivre, id_produit, num_version) VALUES (? , ? , ? , ?, ?, ? , ?, ?)",
                            [_id, bdcParam.listimprevu[product].reference, bdcParam.listimprevu[product].libelle.libelle ? bdcParam.listimprevu[product].libelle.libelle : bdcParam.listimprevu[product].libelle,
                                bdcParam.listimprevu[product].unite, bdcParam.listimprevu[product].Prixreel,
                                bdcParam.listimprevu[product].Qtelivre, bdcParam.listimprevu[product].libelle.id_produit,
                                bdcParam.listimprevu[product].libelle.num_version],
                            function (error, result, fields) {
                                if (error) {
                                    deferred.reject('MySql ERROR trying to update user informations (2) | in adding products ' + error.message);
                                    return;
                                }

                                deferred.resolve();

                            });
                    })(p);

                }


            });
    }


    return deferred.promise;
}

function update(_id, bdcParam) {
    var deferred = Q.defer();
    console.log(bdcParam);
    // validation
    db.query("SELECT * FROM bon_de_commande WHERE id_bdc=?", [_id], function (error, results, fields) {
        if (error) deferred.reject('MySql ERROR trying to update user informations (1) | ' + error.message);

        if (results.length > 0) {
            updateBDC();
        }
    });

    function updateBDC() {

        db.query("UPDATE bon_de_commande SET date_livraison = ?, adresselivraison = ?, livre = ?, tarifpourlivraison = ? WHERE id_bdc = ?",
            [bdcParam.date, bdcParam.adresse, bdcParam.livre, bdcParam.livraison, _id], function (error, results, fields) {
                if (error) deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);


                db.query("DELETE FROM bdc_detaille WHERE id_bdc = ?", [_id], function (error, results, fields) {
                    if (error) deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                    for (var p in bdcParam.products) {

                        (function (product) {


                            db.query("INSERT INTO bdc_detaille (id_bdc, num_version, id_produit, qte, prix_prevu) VALUES (? , ? , ? , ? , ?)",
                                [_id, bdcParam.products[product].num_version, bdcParam.products[product].id_produit, bdcParam.products[product].qte,
                                    bdcParam.products[product].prix_prevu ? bdcParam.products[product].prix_prevu : bdcParam.products[product].ht],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | in adding products ' + error.message);
                                        return;
                                    }


                                    //console.log(result.insertId);
                                    //console.log(result.insertId);
                                });
                        })(p);

                    }
                });

                db.query("DELETE FROM bdc_libre WHERE id_bdc = ?", [_id], function (error, results, fields) {
                    if (error) deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                    for (var p in bdcParam.libre) {

                        (function (product) {


                            db.query("INSERT INTO bdc_libre (id_bdc, nom_prod, reference,unite, qte, prix_prevu) VALUES (? ,? , ? , ? , ? , ?)",
                                [_id, bdcParam.libre[product].nom_prod ? bdcParam.libre[product].nom_prod : bdcParam.libre[product].produit, bdcParam.libre[product].reference ? bdcParam.libre[product].reference : bdcParam.libre[product].ref,bdcParam.libre[product].unite ? bdcParam.libre[product].unite : bdcParam.libre[product].unit, bdcParam.libre[product].qte ? bdcParam.libre[product].qte : bdcParam.libre[product].qtep,
                                    bdcParam.libre[product].prix_prevu ? bdcParam.libre[product].prix_prevu : bdcParam.libre[product].prix_p],
                                function (error, result, fields) {
                                    if (error) {
                                        deferred.reject('MySql ERROR trying to update user informations (2) | in adding products ' + error.message);
                                        return;
                                    }

                                });
                        })(p);

                    }
                });


                deferred.resolve();
            });

    }

    return deferred.promise;
}

function getAllProducts(_id) {
    var deferred = Q.defer();
    //console.log("test");
    db.query('SELECT * FROM bdc_detaille ' +
        'INNER JOIN produit on' +
        ' bdc_detaille.id_produit = produit.id_produit && bdc_detaille.num_version = produit.num_version ' +
        'where id_bdc = ?', [_id], function (error, prods, fields) {

        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(prods);
        deferred.resolve(prods);
    });
    return deferred.promise;
}

function getAllibre(_id) {
    var deferred = Q.defer();
    //console.log("test");
    db.query('SELECT * FROM bdc_libre ' +
        'where id_bdc = ?', [_id], function (error, prods, fields) {

        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(prods);
        deferred.resolve(prods);
    });
    return deferred.promise;
}


function getAllImprevuProducts(_id) {
    var deferred = Q.defer();
    //console.log("test");
    db.query('SELECT * FROM bdc_imprevu WHERE id_bdc = ?', [_id], function (error, prods, fields) {

        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(prods)
        deferred.resolve(prods);
    });
    return deferred.promise;
}

function getAllDate() {
    var deferred = Q.defer();
    db.query('SELECT * FROM bondecommandelist',
        function (error, chantiers, fields) {

            if (error) {
                console.log(error.name + ': ' + error.message)
                deferred.reject(error.name + ': ' + error.message);
            }


            //console.log(chantiers);
            deferred.resolve(chantiers);
        });
    return deferred.promise;
}

/**
 * Ne marche que pour le mois actuel atm, prévoir pour qu'il puisse fonctionner
 * pour n'importe quel mois et ensuite on aura une vue qui permettra de choisir le mois
 */
function getAll(month, year) {
    var deferred = Q.defer();
    db.query('SELECT * FROM bondecommandelist where MONTH(date_livraison) = ? AND YEAR(date_livraison) = ?', [month, year],
        function (error, chantiers, fields) {

            if (error) {
                console.log(error.name + ': ' + error.message)
                deferred.reject(error.name + ': ' + error.message);
            }

            deferred.resolve(chantiers);
        });
    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM bondecommandelist WHERE id_bdc = ? ";
    var inserts = [_id];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, bdc, fields) {
        if (error) {
            //console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        else {
            deferred.resolve(bdc);
        }
    });
    return deferred.promise;
}


function create(bdc_param) {
    var deferred = Q.defer();
    //console.log(bdc_param);

    db.query("INSERT INTO bon_de_commande (adresselivraison, id_fournisseur, date_livraison, date_commande, livre, tarifpourlivraison, id_user, id_chantier)" +
        " VALUES (? , ? , ? , ?, ?, ?, ?, ?)",
        [bdc_param.adresse, bdc_param.id_fournisseur, bdc_param.date, new Date(),
            bdc_param.place, bdc_param.livraison, bdc_param.id_user, bdc_param.id_chantier],
        function (error, results, fields) {
            if (error) deferred.reject(error.name + ': ' + error.message);
            var id_bdc = results.insertId;
            for (var p in bdc_param.products) {
                (function (product) {
                    console.log(bdc_param.products[product]);
                    console.log("INSERT INTO bdc_detaille (id_bdc, id_produit, num_version, qte, prix_prevu) VALUES (? , ? , ? , ? , ?)",
                        [id_bdc,
                            bdc_param.products[product].id_produit,
                            bdc_param.products[product].num_version,
                            bdc_param.products[product].quantite ? bdc_param.products[product].quantite : 1,
                            bdc_param.products[product].prix_prevu ? bdc_param.products[product].prix_prevu : bdc_param.products[product].ht]);
                    db.query("INSERT INTO bdc_detaille (id_bdc, id_produit, num_version, qte, prix_prevu) VALUES (? , ? , ? , ? , ?)",
                        [id_bdc,
                            bdc_param.products[product].id_produit,
                            bdc_param.products[product].num_version,
                            bdc_param.products[product].quantite ? bdc_param.products[product].quantite : 1,
                            bdc_param.products[product].prix_prevu ? bdc_param.products[product].prix_prevu : bdc_param.products[product].ht],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            deferred.resolve();
                        });
                })(p);

            }

            for (var p in bdc_param.listing) {
                (function (product) {
                    console.log(bdc_param.listing[product]);
                    db.query("INSERT INTO bdc_libre (id_bdc, nom_prod,reference, unite, qte, prix_prevu) VALUES (? , ? , ? , ? , ?, ?)",
                        [id_bdc,
                            bdc_param.listing[product].produit,
                            bdc_param.listing[product].referencef,
                            bdc_param.listing[product].unitef,
                            bdc_param.listing[product].qtef ? bdc_param.listing[product].qtef : 1,
                            bdc_param.listing[product].prixf ],
                        function (error, result, fields) {
                            if (error) {
                                deferred.reject('MySql ERROR trying to update user informations (2) | ' + error.message);
                            }
                            deferred.resolve();
                        });
                })(p);

            }

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


function demandes(facture_param) {
    var deferred = Q.defer();

    db.query("INSERT INTO demandeprix (nom_fournisseur,chantier) VALUES (? , ?)",
        [facture_param.demande.nomFournisseur.nom, facture_param.demande.nomChantier.nom_chantier],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            for (var p in facture_param.list) {
                (function (facture) {
                    db.query("INSERT INTO demande_detail (id_demande,nom_produit,unite,qte ) VALUES (? ,? , ? , ?)",
                        [results.insertId, facture_param.list[facture].reference ? facture_param.list[facture].reference : facture_param.list[facture].libelle, facture_param.list[facture].unite, facture_param.list[facture].qte],
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

function getAllListing() {
    var deferred = Q.defer();
    db.query('SELECT  * FROM demandeprix ORDER BY id_demande  DESC ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(produits);
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getByIdDetail(id_demande) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM demande_detail WHERE id_demande = ? ";
    var inserts = [id_demande];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, bdc, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        else {
            deferred.resolve(bdc);
        }
    });
    return deferred.promise;
}