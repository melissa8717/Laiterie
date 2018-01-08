// produits achats
// sont stockes sand la table 'produit'

let Q = require('q');
let mysql = require('mysql');
let db = require('../db.js').get();

let service = {};

service.getAllMainOeuvre = getAllMainOeuvre;
service.createMainOeuvre = createMainOeuvre;
service.updateMainOeuvre = updateMainOeuvre;

service.getAllProduitsAchat = getAllProduitsAchat;

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;

service.updatevehmat = updatevehmat;
service.getByIdmat = getByIdmat;
service.getByIdvehmat = getByIdvehmat;
service.getAllVehimat = getAllVehimat;
service.addMat = addMat;
service.deletemat = deletemat;
service.getByIdEntretien = getByIdEntretien;
service.getByIdEntretien1 = getByIdEntretien1;
service.addEntretien = addEntretien;
service.deleteEntre = deleteEntre;

service.getAllStock = getAllStock;
service.getStockclick = getStockclick;

service.updateModif = updateModif;
service.getAllHisto = getAllHisto;

service.getAllRef = getAllRef;
service.getAllTva = getAllTva;
service.getAllCategories = getAllCategories;
service.getAllUnite = getAllUnite;
service.getAllFournisseur = getAllFournisseur;
service.getAllProdComp = getAllProdComp;

service.getAllImg = getAllImg;

service.getAllEnStock = getAllEnStock;

module.exports = service;


function getAllStock() {
    let deferred = Q.defer();
    db.query('SELECT  produit.`id_produit`,`libelle`,reference, produit.id_contact,stock.`stock`,stock.`stockmini`,stock.`stockmaxi`, MAX(produit.num_version) as num_version,contact.nom,prix_achat\
    FROM produit, stock,contact\
      WHERE stock.id_produit = produit.id_produit \
      AND contact.id_contact = produit.id_contact\
      GROUP BY produit.id_produit\ ORDER BY libelle \ ASC ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getStockclick(id_product, stock) {
    let deferred = Q.defer();

    let params = [
        stock,
        id_product
    ];

    let query = "UPDATE stock SET  stock = ? WHERE id_produit = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });
    return deferred.promise;
}


function getAll() {
    let deferred = Q.defer();
    db.query('SELECT produit.*, contact.* FROM produit ' +
        'LEFT JOIN contact on produit.id_contact = contact.id_contact ' +
        'where produit.type != 1  && (produit.num_version , produit.id_produit) IN (SELECT MAX(num_version), id_produit\
        FROM produit group by id_produit)' +
        'ORDER BY produit.libelle ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(produits);
    });
    return deferred.promise;
}


function getAllProduitsAchat() {
    let deferred = Q.defer();
    db.query('SELECT produit.*, contact.nom AS contact_name ,contact.raison_sociale, produit_categorie.libelle AS cat_libelle FROM produit ' +
        'LEFT JOIN contact on produit.id_contact = contact.id_contact ' +
        'LEFT JOIN produit_categorie ON produit.id_cat = produit_categorie.id_cat ' +
        'where produit.type != 1  && (produit.num_version , produit.id_produit) IN (SELECT MAX(num_version), id_produit\
        FROM produit group by id_produit)' +
        'ORDER BY produit.libelle ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function createMainOeuvre(moParams) {
    let deferred = Q.defer();

    let params = [
        moParams.libelle,
        moParams.taux_horaire,
        moParams.heure_brute,
        moParams.salaire_charge
    ];

    // type = 1 pour indiquer que c'est un main d'oeuvre
    let query = "INSERT INTO produit (libelle, taux_horaire, heure_brute, salaire_charge,  tarif_du, prix_achat, marge, type) " +
        "VALUES (? , ? , ?, ?, NOW(), 0, 0, 1 )";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}

function getAllMainOeuvre() {
    let deferred = Q.defer();
    db.query('SELECT * FROM produit WHERE type = 1 order by libelle ASC', function (error, mainoeuvres, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(mainoeuvres);
    });
    return deferred.promise;
}

function updateMainOeuvre(id_mo, moParam) {
    let deferred = Q.defer();

    let params = [
        moParam.libelle,
        moParam.taux_horaire,
        moParam.heure_brute,
        moParam.salaire_charge,
        id_mo
    ];

    let query = "UPDATE produit SET libelle = ?, taux_horaire = ?, heure_brute = ?, salaire_charge = ? WHERE id_produit = ?";

    db.query(query, params, function (error) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve();
    });
    return deferred.promise;
}

function getById(_id, num_version) {
    let deferred = Q.defer();

    let sql = "SELECT produit.*,stock.* FROM produit " +
        "LEFT JOIN stock on stock.id_produit = produit.id_produit " +
        "WHERE produit.id_produit = ? && num_version = ? ";

    let inserts = [_id, num_version];
    sql = mysql.format(sql, inserts);

    db.query(sql, inserts, function (error, product) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(product);
    });
    return deferred.promise;
}

function create(productParam) {
    let deferred = Q.defer();

    let params = [
        productParam.libelle,
        productParam.id_contact,
        productParam.reference,
        productParam.categorie,

        productParam.id_user,
        productParam.unite,
        productParam.prix_achat,
        productParam.id_tva,

        productParam.description,
        productParam.note,
        productParam.stockmini,
        productParam.stockmaxi
    ];

    let query = "INSERT INTO produit (libelle, id_contact, reference, id_cat, tarif_du, id_user, unite, prix_achat, id_tva, " +
        "description, note, stockmini, stockmaxi, type) VALUES (? , ? , ? , ?, NOW() ,?, ? , ? , ? , ?, ?, ?, ?, 0 )";

    db.query(query, params, function (error, results) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);

        let params = [
            results.insertId,
            0,
            productParam.stockmini,
            productParam.stockmaxi];

        let query = "INSERT INTO stock (id_produit, stock, stockmini, stockmaxi ) VALUES (? , ? , ? , ? )";

        db.query(query, params, function (error) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
        });
    });

    return deferred.promise;
}

function _delete(_id) {
    let deferred = Q.defer();
    db.query("DELETE FROM produit WHERE id_produit = ? ", [_id], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve();
    });

    return deferred.promise;
}

function update(id_produit, productParam) {
    let deferred = Q.defer();

    let params = [
        productParam.id_produit
    ];

    let query = "SELECT MAX(num_version) as max FROM produit WHERE id_produit = ? ";

    db.query(query, params, function (error, results) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        let num_version = +results[0].max + 1;

        let params = [
            productParam.id_produit,
            num_version,
            productParam.libelle,
            productParam.id_contact,
            productParam.reference,
            productParam.id_cat,

            productParam.id_user,
            productParam.unite,
            productParam.prix_achat,
            productParam.id_tva,

            productParam.description,
            productParam.note,

            productParam.image_url
        ];

        let query = "INSERT INTO produit (id_produit, num_version, libelle, id_contact, reference, id_cat, tarif_du, id_user, unite, prix_achat, id_tva, " +
            "description, note, type, image_url) VALUES (? , ? , ? , ?,  ? , ?, NOW() ,?, ? , ? , ?, ?, ?, 0 ,?)";

        db.query(query, params, function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }

            let params = [
                productParam.stock,
                productParam.stockmini,
                productParam.stockmaxi,
                results.insertId];

            let query = "UPDATE stock SET stock = ?, stockmini = ?, stockmaxi = ? WHERE id_produit = ?";

            db.query(query, params, function (error, results) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                }
                deferred.resolve(results);
            });
        });
    });

    return deferred.promise;
}

function getAllTva() {
    let deferred = Q.defer();
    db.query('SELECT * FROM tva', function (error, tvas, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(tvas);
    });
    return deferred.promise;
}

function getAllFournisseur() {
    let deferred = Q.defer();
    db.query("SELECT * FROM contact WHERE type = 'Fournisseur' OR type =  'Sous-traitant'", function (error, fournisseurs, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(fournisseurs);
    });
    return deferred.promise;
}

function getAllCategories() {
    let deferred = Q.defer();
    db.query("SELECT * FROM produit_categorie", function (error, categories, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(categories);
    });
    return deferred.promise;
}

function getAllUnite() {
    let deferred = Q.defer();
    db.query("SELECT * FROM cat_unite", function (error, unites, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(unites);
    });
    return deferred.promise;
}

function getAllProdComp() {
    let deferred = Q.defer();
    db.query('SELECT * FROM produit_compose', function (error, prd_comp, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(prd_comp);
    });
    return deferred.promise;
}

function updateModif(modifParams) {

    let deferred = Q.defer();
    let params = [
        modifParams.id_produit,
        modifParams.id_contact
    ];

    let query = "INSERT INTO produit_histo (id_produit, id_contact, date_histo) VALUES (?, ?, NOW())";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getAllHisto(_id) {
    let deferred = Q.defer();
    db.query('SELECT * FROM produit\
    JOIN users ON produit.id_user = users.id\
    WHERE produit.id_produit = ?\
    ORDER BY produit.num_version DESC'
        , [_id], function (error, histo, fields) {
            if (error) deferred.reject(error.name + ': ' + error.message);

            deferred.resolve(histo);
        });
    return deferred.promise;

}


function addMat(matParam) {
    let params;
    let deferred = Q.defer();
    params = [
        matParam.libelle,
        matParam.marque,
        matParam.vehimate,
        matParam.energie,
        matParam.type,
        matParam.annee,
        matParam.datectrltech,
        matParam.immatriculation,
        matParam.genre,
        matParam.date1ctrl,
        matParam.carrosserie,
        matParam.puissance,
        matParam.pl_ass,
        matParam.nserie,
        matParam.poidstc,
        matParam.poidsvide,
        matParam.bruit,
        matParam.regmot,
        matParam.remarque,
        matParam.dateachat,
        matParam.datevente,
        matParam.visite_ampliroll,
        matParam.visite_grue,
        matParam.pneu_av,
        matParam.pneu_ar,
        matParam.gps,
        matParam.code_poste,
        matParam.largeur,
        matParam.surface,
        matParam.gr,
        matParam.ncartegr,
        matParam.date_depreciation,
        matParam.ntelepeage,
        matParam.geolocalisation,
        matParam.poidstr,
        matParam.fgarant,
        matParam.dgarant
    ];

    let query = "INSERT INTO Vehiculemateriel (libelle,marque,vehimate,energie,type,annee,datectrltech,immatriculation,genre,date1ctrl,carrosserie,puissance,pl_ass,nserie,poidstc,poidsvide,bruit,regmot,remarque,dateachat,datevente,visite_ampliroll,visite_grue,pneu_av,pneu_ar,gps,code_poste,largeur,surface,gr,ncartegr,date_depreciation,ntelepeage,geolocalisation,poidstr,fgarant,dgarant) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    db.query(query, params, function (error, results) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}

function getAllVehimat() {
    let deferred = Q.defer();
    db.query('SELECT  `id_vehmat`,`libelle`,`marque`,`immatriculation`,`nserie`,`type`,`vehimate`,`annee`\
    FROM Vehiculemateriel \ ORDER BY libelle \ ASC ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getByIdvehmat(_id_vehmat) {
    let deferred = Q.defer();
    let sql = "SELECT * FROM Vehiculemateriel WHERE id_vehmat = ?";
    let inserts = [_id_vehmat];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, product, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function updatevehmat(id_vehmat, matParam) {
    let deferred = Q.defer();

    let params = [
        matParam.libelle,
        matParam.marque,
        matParam.vehimate,
        matParam.energie,
        matParam.type,
        matParam.annee,
        matParam.datectrltech,
        matParam.immatriculation,
        matParam.genre,
        matParam.date1ctrl,
        matParam.carrosserie,
        matParam.puissance,
        matParam.pl_ass,
        matParam.nserie,
        matParam.poidstc,
        matParam.poidsvide,
        matParam.bruit,
        matParam.regmot,
        matParam.remarque,
        matParam.dateachat,
        matParam.datevente,
        matParam.visite_ampliroll,
        matParam.visite_grue,
        matParam.pneu_av,
        matParam.pneu_ar,
        matParam.gps,
        matParam.code_poste,
        matParam.largeur,
        matParam.surface,
        matParam.gr,
        matParam.ncartegr,
        matParam.date_depreciation,
        matParam.ntelepeage,
        matParam.geolocalisation,
        matParam.poidstr,
        matParam.fgarant,
        matParam.dgarant,
        matParam.image_vh,
        id_vehmat
    ];

    let query = "UPDATE Vehiculemateriel SET libelle=?,marque=?,vehimate=?,energie=?,type=?,annee=?,datectrltech=?,immatriculation=?,genre=?,date1ctrl=?,carrosserie=?,puissance=?,pl_ass=?,nserie=?,poidstc=?,poidsvide=?,bruit=?,regmot=?,remarque=?,dateachat=?,datevente=?,visite_ampliroll=?,visite_grue=?,pneu_av=?,pneu_ar=?,gps=?,code_poste=?,largeur=?,surface=?,gr=?,ncartegr=?,date_depreciation=?,ntelepeage=?,geolocalisation=?,poidstr=?,fgarant=?,dgarant=?,image_vh=? WHERE id_vehmat = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });
    return deferred.promise;
}

function getByIdmat(_id_vehmat) {
    let deferred = Q.defer();
    let sql = "SELECT * FROM Vehiculemateriel WHERE id_vehmat = ?";
    let inserts = [_id_vehmat];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, product, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function deletemat(_id_vehmat) {
    let deferred = Q.defer();
    db.query("DELETE FROM Vehiculemateriel WHERE id_vehmat = ? ", [_id_vehmat], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}

function getByIdEntretien(_id_vehmat) {
    let deferred = Q.defer();
    let sql = "SELECT  * FROM entretien WHERE id_vehmat = ?";
    let inserts = [_id_vehmat];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, product, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function getByIdEntretien1(_id_vehmat) {
    let deferred = Q.defer();
    let sql = "SELECT  * FROM entretien WHERE id_vehmat = ?";
    let inserts = [_id_vehmat];
    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, product, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function getAllRef(reference) {
    let deferred = Q.defer();
    let sql = "SELECT reference FROM produit WHERE reference = ?";
    let inserts = [reference];

    sql = mysql.format(sql, inserts);
    db.query(sql, function (error, product, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function addEntretien(EParams, id_vehmat) {
    let deferred = Q.defer();

    let params = [
        EParams.date,
        EParams.motif,
        EParams.tarif,
        id_vehmat
    ];

    let query = "INSERT INTO entretien (date, motif, tarif,id_vehmat) VALUES (? , ? , ?, ?)";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}

function deleteEntre(_id_entretien) {
    let deferred = Q.defer();
    db.query("DELETE FROM entretien WHERE id_entretien = ? ", [_id_entretien], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve();
    });

    return deferred.promise;
}


function getAllImg() {
    let deferred = Q.defer();
    db.query('SELECT * from produit',
        function (error, produit, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
            deferred.resolve(produit);
        });
    return deferred.promise;
}

function getAllEnStock() {
    let deferred = Q.defer();
    db.query('SELECT produit.libelle, produit.id_produit,produit.num_version,produit.prix_achat, produit.reference, produit.unite, stock.stock AS enstock FROM produit '+
    'LEFT JOIN stock ON stock.id_produit = produit.id_produit '+
    'WHERE produit.type !=1 && ( produit.num_version, produit.id_produit )IN (SELECT MAX( num_version ) , id_produit FROM produit '+
    'GROUP BY id_produit) ORDER BY produit.libelle ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(produits);
    });
    return deferred.promise;
}