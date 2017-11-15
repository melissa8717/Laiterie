// prioduits ventes
// sont stockes dans produit_vente + produit_compose

var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var service = {};

service.getAll = getAll;
service.getById = getById;
service.getAllById = getAllById;
service.create = create;
service.createVersion = createVersion;
service.delete = _delete;
service.update = update;

service.addInProdComposes = addInProdComposes;
service.getAllProdComp = getAllProdComp;

module.exports = service;

function getAll() {
    //console.log("get all service");
    var deferred = Q.defer();
    db.query('\
    SELECT produit_vente.*, \
           produit_categorie.libelle AS cat_libelle \
    FROM produit_vente \
    LEFT OUTER JOIN produit_categorie ON produit_vente.categorie = produit_categorie.id_cat \
    WHERE (produit_vente.num_version , produit_vente.id_prc) IN (SELECT MAX(num_version), id_prc\
    FROM produit_vente group by id_prc)\
    ORDER BY produit_vente.libelle \ \
    ASC', function (error, produits, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        // console.log(produits);
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getAllProdComp(_id, num_version) {
    //console.log("get prod comp in service");
    var deferred = Q.defer();
    db.query('SELECT * FROM produit_compose ' +
        'LEFT JOIN produit on produit.id_produit = produit_compose.id_produit && produit.num_version = produit_compose.achat_version ' +
        'LEFT JOIN contact on contact.id_contact = produit.id_contact ' +
        'WHERE id_prc = ? && produit.type = 0 && produit_compose.num_version = ?',
        [_id, num_version],
        function (error, produit, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }

            db.query('SELECT * FROM produit_compose ' +
                'LEFT JOIN produit on produit.id_produit = produit_compose.id_produit ' +
                'WHERE id_prc = ? && type = 1 && produit_compose.num_version = ?',
                [_id, num_version],
                function (error, mo, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }
                    var tmp = {};
                    tmp.produits = produit;
                    tmp.mainOeuvre = mo;
                    //console.log(tmp);
                    deferred.resolve(tmp);
                });
        });
    return deferred.promise;
}


function getAllById(_id) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM produit_vente " +
        "LEFT JOIN users on users.id = produit_vente.id_user " +
        "WHERE id_prc = ? " +
        "ORDER BY produit_vente.num_version DESC";
    var inserts = [_id];
    sql = mysql.format(sql, inserts);
    db.query(sql, [_id], function (error, product, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function getById(_id, num_version) {
    var deferred = Q.defer();
    var sql = "SELECT produit_vente . * , produit_categorie.libelle AS catlibel FROM produit_vente , produit_categorie WHERE (id_prc = ? AND num_version = ?)  AND produit_categorie.id_cat = produit_vente.categorie";
    var inserts = [_id, num_version];
    sql = mysql.format(sql, inserts);
    db.query(sql, [_id], function (error, product, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(product);
    });
    return deferred.promise;
}


function createVersion(productParam) {
    var deferred = Q.defer();

    //console.log(productParam);

    var params = [
        productParam.produit.id_prc
    ];

    var query = "SELECT MAX(num_version) as max FROM produit_vente WHERE id_prc = ? "

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        var num_version = +results[0].max + 1;

        //console.log(num_version);


        var params = [
            productParam.produit.id_prc,
            num_version,
            productParam.produit.libelle,
            productParam.produit.description,
            productParam.produit.note,
            productParam.produit.unite,
            productParam.produit.categorie,
            productParam.produit.prix_achat,
            productParam.produit.marge,
            productParam.produit.margemin,
            productParam.produit.margepc,
            productParam.produit.prix_vente,

        ];

        var query = "INSERT INTO produit_vente (id_prc, num_version, libelle, description, note, unite, categorie, prix_achat, marge, margemin, margepc, prix_vente) " +
            "VALUES ( ?,  ? ,?, ?, ?, ?, ?, ?, ?, ?, ? , ? )";

        //console.log(params)

        db.query(query, params, function (error, results, fields) {
            if (error) {
                console.log(error.name + ': ' + error.message);
                deferred.reject(error.name + ': ' + error.message);
            }

            for (var p in productParam.produits) {
                (function (product) {
                    var params = [
                        productParam.produit.id_prc,
                        num_version,
                        productParam.produits[product].id_produit,
                        productParam.produits[product].num_version,
                        productParam.produits[product].quantite,
                        productParam.produits[product].prix_achat,
                    ];

                    var query = "INSERT INTO produit_compose (id_prc, num_version, id_produit,achat_version, quantite, prix_achat) " +
                        "VALUES (?, ?, ?, ?, ?, ? )";


                    db.query(query, params, function (error, results, fields) {
                        if (error) {
                            console.log(error.name + ': ' + error.message);
                            deferred.reject(error.name + ': ' + error.message);
                        }

                        if (product == (productParam.produits.length - 1)) {
                            deferred.resolve();
                        }

                    });

                })(p);
            }


            for (var p in productParam.mainOeuvre) {
                (function (product) {
                    var params = [
                        productParam.produit.id_prc,
                        num_version,
                        productParam.mainOeuvre[product].id_produit,
                        productParam.mainOeuvre[product].quantite,
                        productParam.mainOeuvre[product].salaire_charge
                    ];
                    query = "INSERT INTO produit_compose (id_prc,num_version, id_produit, quantite, prix_achat) " +
                        "VALUES (?, ?, ?, ?, ? )";

                    db.query(query, params, function (error, results, fields) {
                        if (error) {
                            console.log(error.name + ': ' + error.message);
                            deferred.reject(error.name + ': ' + error.message);
                        }

                    });

                })(p);
            }
        });

    });


    return deferred.promise;
}

function create(productParam) {

    var deferred = Q.defer();
    //console.log(productParam);

    var params = [
        productParam.produit.libelle,
        productParam.produit.description,
        productParam.produit.note,
        productParam.produit.unite,
        productParam.produit.categorie,
        productParam.produit.prix_achat,
        productParam.produit.marge,
        productParam.produit.margepcmin,
        productParam.produit.margepc,
        productParam.produit.prix_vente
    ];

    var query = "INSERT INTO produit_vente (libelle, description, note, unite, categorie, prix_achat, marge, margemin, margepc, prix_vente) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

    console.log(query, params);

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }


        var id_prc = results.insertId;

        for (var p in productParam.produits) {
            (function (product) {
                var params = [
                    id_prc,
                    productParam.produits[product].id_produit,
                    productParam.produits[product].num_version,
                    productParam.produits[product].quantite,
                    productParam.produits[product].prix_achat,
                ];

                var query = "INSERT INTO produit_compose (id_prc, id_produit, achat_version, quantite, prix_achat) " +
                    "VALUES (?, ?, ?, ?, ? )";


                db.query(query, params, function (error, results, fields) {
                    if (error) {
                        console.log(error.name + ': ' + error.message);
                        deferred.reject(error.name + ': ' + error.message);
                    }

                    if (product == productParam.produits.length - 1) {
                        deferred.resolve();
                    }

                });

            })(p);
        }


        for (var p in productParam.mainOeuvre) {
            (function (product) {
                var params = [
                    id_prc,
                    productParam.mainOeuvre[product].id_produit,
                    productParam.mainOeuvre[product].quantite,
                    productParam.mainOeuvre[product].salaire_charge
                ];
                query = "INSERT INTO produit_compose (id_prc, id_produit, quantite, prix_achat) " +
                    "VALUES (?, ?, ?, ? )";

                db.query(query, params, function (error, results, fields) {
                    if (error) {
                        console.log(error.name + ': ' + error.message);
                        deferred.reject(error.name + ': ' + error.message);
                    }

                });

            })(p);
        }


    });
    return deferred.promise;
}

function addInProdComposes(productParam) {
    var deferred = Q.defer();

    //console.log(JSON.stringify(productParam));

    var params = [
        productParam.id_prc,
        productParam.id_produit,
        productParam.quantite
    ];

    var query = "INSERT INTO produit_compose (id_prc, id_produit, quantite) VALUES (?, ?, ? )";

    db.query(query, params, function (error, results, fields) {
        console.log("params: " + params);
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve();

    });
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    db.query("DELETE FROM produit_vente WHERE id_prc = ? ", [_id], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        db.query("DELETE FROM produit_compose WHERE id_prc = ?", [_id], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
            deferred.resolve();
        })

    });

    return deferred.promise;
}

function update(id_product, productParam) {
    var deferred = Q.defer();

    var params = [
        productParam.marge,
        productParam.prix_vente,
        id_product
    ];

    var query = "UPDATE produit_vente SET marge = ?, prix_vente = ? WHERE id_prc = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log("error updating prod vente: " + error);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });
    return deferred.promise;
}