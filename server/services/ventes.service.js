// prioduits ventes
// sont stockes dans produit_vente + produit_compose

let Q = require('q');
let mysql = require('mysql');
let db = require('../db.js').get();

let service = {};

service.getAll = getAll;
service.getById = getById;
service.getAllHisto = getAllHisto;
service.create = create;
service.createVersion = createVersion;
service.delete = _delete;
service.update = update;

service.addInProdComposes = addInProdComposes;
service.getAllProdComp = getAllProdComp;

module.exports = service;

function getAll() {
    let deferred = Q.defer();
    db.query('\
    SELECT produit_vente.*, \
           produit_categorie.libelle AS cat_libelle , cat_unite.libelle as uni \
    FROM produit_vente \
    LEFT JOIN cat_unite ON cat_unite.id_unite = produit_vente.unite \
    LEFT OUTER JOIN produit_categorie ON produit_vente.categorie = produit_categorie.id_cat \
    WHERE (produit_vente.num_version , produit_vente.id_prc) IN (SELECT MAX(num_version), id_prc\
    FROM produit_vente group by id_prc)\
    ORDER BY produit_vente.libelle \ \
    ASC', function (error, produits, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getAllProdComp(_id, num_version) {
    let deferred = Q.defer();
    db.query('SELECT * FROM produit_compose ' +
        'LEFT JOIN produit on produit.id_produit = produit_compose.id_produit && produit.num_version = produit_compose.achat_version ' +
        'LEFT JOIN contact on contact.id_contact = produit.id_contact ' +
        'WHERE id_prc = ? && produit.type = 0 && produit_compose.num_version = ?',
        [_id, num_version],
        function (error, produits) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }

            db.query('SELECT * FROM produit_compose ' +
                'LEFT JOIN produit on produit.id_produit = produit_compose.id_produit ' +
                'WHERE id_prc = ? && type = 1 && produit_compose.num_version = ?',
                [_id, num_version],
                function (error, mo) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }
                    let tmp = {};
                    tmp.produits = produits;
                    tmp.mainOeuvre = mo;
                    deferred.resolve(tmp);
                });
        });
    return deferred.promise;
}


function getAllHisto(_id) {
    let deferred = Q.defer();
    let sql = "SELECT * FROM produit_vente " +
        "JOIN users ON produit_vente.id_user = users.id " +
        "WHERE produit_vente.id_prc = ? " +
        "ORDER BY produit_vente.num_version DESC";

    db.query(sql, [_id], function (error, product) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(product);
    });
    return deferred.promise;
}

function getById(_id, num_version) {
    let deferred = Q.defer();
    let sql = "SELECT produit_vente.* , produit_categorie.libelle AS cat_libelle, produit_categorie.id_cat, produit_vente.image AS image_url FROM produit_vente , produit_categorie WHERE (id_prc = ? AND num_version = ?)  AND produit_categorie.id_cat = produit_vente.categorie";
    let inserts = [_id, num_version];
    sql = mysql.format(sql, inserts);
    db.query(sql, [_id], function (error, product, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(product);
    });
    return deferred.promise;
}


function createVersion(productParam) {
    let deferred = Q.defer();

    let params = [
        productParam.produit.id_prc
    ];

    let query = "SELECT MAX(num_version) as max FROM produit_vente WHERE id_prc = ? "

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        let num_version = +results[0].max + 1;

        let params = [
            productParam.produit.id_prc,
            num_version,
            productParam.produit.libelle,
            productParam.produit.description,
            productParam.produit.note,
            productParam.produit.unite,
            productParam.produit.id_cat,
            productParam.produit.prix_achat,
            productParam.produit.marge,
            productParam.produit.margemin,
            productParam.produit.margepc,
            productParam.produit.prix_vente,
            productParam.produit.id_user
        ];

        let query = "INSERT INTO produit_vente (id_prc, num_version, libelle, description, note, unite, categorie, prix_achat, marge, margemin, margepc, prix_vente, id_user) " +
            "VALUES ( ?,  ? ,?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ? )";

        db.query(query, params, function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }

            for (let p of productParam.produits) {

                params = [
                    productParam.produit.id_prc,
                    num_version,
                    p.id_produit,
                    p.num_version,
                    p.quantite,
                    p.prix_achat
                ];

                let query = "INSERT INTO produit_compose (id_prc, num_version, id_produit,achat_version, quantite, prix_achat) " +
                    "VALUES (?, ?, ?, ?, ?, ? )";


                db.query(query, params, function (error) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }

                    deferred.resolve();
                });
            }


            for (let mo of productParam.mainOeuvre) {
                let params = [
                    productParam.produit.id_prc,
                    num_version,
                    mo.id_produit,
                    mo.quantite,
                    mo.salaire_charge
                ];
                query = "INSERT INTO produit_compose (id_prc,num_version, id_produit, quantite, prix_achat) " +
                    "VALUES (?, ?, ?, ?, ? )";

                db.query(query, params, function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }

                });
            }
        });

    });


    return deferred.promise;
}

function create(productParam) {
    let deferred = Q.defer();

    let params = [
        productParam.produit.libelle,
        productParam.produit.description,
        productParam.produit.note,
        productParam.produit.unite,
        productParam.produit.id_cat,
        productParam.produit.prix_achat,
        productParam.produit.marge,
        productParam.produit.margepcmin,
        productParam.produit.margepc,
        productParam.produit.prix_vente,
        productParam.produit.id_user
    ];

    let query = "INSERT INTO produit_vente (libelle, description, note, unite, categorie, prix_achat, marge, margemin, margepc, prix_vente, id_user) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(query, params, function (error, results) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

        let id_prc = results.insertId;

        for (let p of productParam.produits) {
            let params = [
                id_prc,
                p.id_produit,
                p.num_version,
                p.quantite,
                p.prix_achat,
            ];

            let query = "INSERT INTO produit_compose (id_prc, id_produit, achat_version, quantite, prix_achat) " +
                "VALUES (?, ?, ?, ?, ? )";

            db.query(query, params, function (error) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                }

                deferred.resolve();
            });
        }


        for (let p of productParam.mainOeuvre) {
            let params = [
                id_prc,
                p.id_produit,
                p.quantite,
                p.salaire_charge
            ];
            query = "INSERT INTO produit_compose (id_prc, id_produit, quantite, prix_achat) " +
                "VALUES (?, ?, ?, ? )";

            db.query(query, params, function (error, results, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                }
            });
        }
    });
    return deferred.promise;
}

function addInProdComposes(productParam) {
    let deferred = Q.defer();

    let params = [
        productParam.id_prc,
        productParam.id_produit,
        productParam.quantite
    ];

    let query = "INSERT INTO produit_compose (id_prc, id_produit, quantite) VALUES (?, ?, ? )";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve();
    });
    return deferred.promise;
}

function _delete(_id) {
    let deferred = Q.defer();
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
    let deferred = Q.defer();

    let params = [
        productParam.marge,
        productParam.prix_vente,
        id_product
    ];

    let query = "UPDATE produit_vente SET marge = ?, prix_vente = ? WHERE id_prc = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });
    return deferred.promise;
}