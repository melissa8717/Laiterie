// produits achats
// sont stockes sand la table 'produit'

var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var service = {};

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

module.exports = service;


function getAllStock() {
    var deferred = Q.defer();
    db.query('SELECT  produit.`id_produit`,`libelle`,reference, produit.id_contact,stock.`stock`,stock.`stockmini`,stock.`stockmaxi`, MAX(produit.num_version) as num_version,contact.nom,prix_achat\
    FROM produit, stock,contact\
      WHERE stock.id_produit = produit.id_produit \
      AND contact.id_contact = produit.id_contact\
      GROUP BY produit.id_produit\ ORDER BY libelle \ ASC ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(produits);
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getStockclick(id_product, stock) {
    console.log("update prod service server");
    var deferred = Q.defer();

    var params = [
        stock,
        id_product
    ];

    var query = "UPDATE stock SET  stock = ? WHERE id_produit = ?";


    console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }


        deferred.resolve();
    });
    return deferred.promise;
}


function getAll() {
    var deferred = Q.defer();
    db.query('SELECT produit.*, contact.* FROM produit ' +
        'LEFT JOIN contact on produit.id_contact = contact.id_contact ' +
        'where produit.type != 1  && (produit.num_version , produit.id_produit) IN (SELECT MAX(num_version), id_produit\
        FROM produit group by id_produit)' +
        'ORDER BY produit.libelle ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(produits);
        deferred.resolve(produits);
    });
    return deferred.promise;
}


function getAllProduitsAchat() {
    var deferred = Q.defer();
    db.query('SELECT produit.*, contact.* , produit_categorie.libelle AS catlibel FROM produit ' +
        'LEFT JOIN contact on produit.id_contact = contact.id_contact ' +
        'LEFT JOIN produit_categorie ON produit.id_cat = produit_categorie.id_cat ' +
        'where produit.type != 1  && (produit.num_version , produit.id_produit) IN (SELECT MAX(num_version), id_produit\
        FROM produit group by id_produit)' +
        'ORDER BY produit.libelle ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function createMainOeuvre(moParams) {
    var deferred = Q.defer();

    var params = [
        moParams.libelle,
        moParams.taux_horaire,
        moParams.heure_brute,
        moParams.salaire_charge,
    ];

    // type = 1 pour indiquer que c'est un main d'oeuvre
    var query = "INSERT INTO produit (libelle, taux_horaire, heure_brute, salaire_charge,  tarif_du, prix_achat, marge, type) " +
        "VALUES (? , ? , ?, ?, NOW(), 0, 0, 1 )";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        //console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllMainOeuvre() {
    var deferred = Q.defer();
    db.query('SELECT * FROM produit WHERE type = 1 order by libelle ASC', function (error, mainoeuvres, fields) {
        if (error) {

            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(mainoeuvres);
        deferred.resolve(mainoeuvres);
    });
    return deferred.promise;
}

function updateMainOeuvre(id_mo, moParam) {
    //console.log("updating mo service");
    var deferred = Q.defer();

    var params = [
        moParam.libelle,
        moParam.taux_horaire,
        moParam.heure_brute,
        moParam.salaire_charge,


        id_mo
    ];

    //console.log("id prod: " + id_mo);

    var query = "UPDATE produit SET libelle = ?, taux_horaire = ?, heure_brute = ?, salaire_charge = ? WHERE id_produit = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve();
    });
    return deferred.promise;
}

function getById(_id, num_version) {
    var deferred = Q.defer();
    var sql = "SELECT produit.*,contact.*,stock.*,produit_categorie.libelle AS libcat FROM produit " +
        "LEFT JOIN contact on contact.id_contact = produit.id_contact " +
        "LEFT JOIN stock on stock.id_produit = produit.id_produit " +
        "LEFT JOIN produit_categorie ON produit_categorie.id_cat = produit.id_cat " +
        "WHERE produit.id_produit = ? && num_version = ? " +
        "&& stock.id_produit = produit.id_produit";
    var inserts = [_id, num_version];
    sql = mysql.format(sql, inserts);
    db.query(sql, [_id], function (error, product, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function create(productParam) {
    var deferred = Q.defer();

    var params = [
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

    var query = "INSERT INTO produit (libelle, id_contact, reference, id_cat, tarif_du, id_user, unite, prix_achat, id_tva, " +
        "description, note, stockmini, stockmaxi, type) VALUES (? , ? , ? , ?, NOW() ,?, ? , ? , ? , ?, ?, ?, ?, 0 )";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            //console.log("error in create service");
            deferred.reject(error.name + ': ' + error.message);
        }

        var params = [
            results.insertId,
            0,
            productParam.stockmini,
            productParam.stockmaxi];

        var query = "INSERT INTO stock (id_produit, stock, stockmini, stockmaxi ) VALUES (? , ? , ? , ? )";

        db.query(query, params, function (error, results, fields) {
            if (error) {
                //console.log("error in create service");
                deferred.reject(error.name + ': ' + error.message);
            }
            //console.log(results);
            deferred.resolve(results);
        });

    });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    db.query("DELETE FROM produit WHERE id_produit = ? ", [_id], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve();
    });

    return deferred.promise;
}

function update(id_product, productParam) {
    var deferred = Q.defer();

    var params = [
        productParam.id_produit
    ];

    var query = "SELECT MAX(num_version) as max FROM produit WHERE id_produit = ? ";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        var num_version = +results[0].max + 1;

        var params = [
            productParam.id_produit,
            num_version,

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

        //console.log(productParam);

        var query = "INSERT INTO produit (id_produit, num_version, libelle, id_contact, reference, id_cat, tarif_du, id_user, unite, prix_achat, id_tva, " +
            "description, note, stockmini, stockmaxi, type) VALUES (? , ? , ? , ?,  ? , ?, NOW() ,?, ? , ? , ? , ?, ?, ?, ?, 0 )";

        db.query(query, params, function (error, results, fields) {
            if (error) {
                //console.log("error in create service");
                deferred.reject(error.name + ': ' + error.message);
            }

            //console.log(results);
            deferred.resolve(results);

        });
    });

    return deferred.promise;
}

function getAllTva() {
    var deferred = Q.defer();
    db.query('SELECT * FROM tva', function (error, tvas, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(tvas);
    });
    return deferred.promise;
}

function getAllFournisseur() {
    var deferred = Q.defer();
    db.query("SELECT * FROM contact WHERE type = 'Fournisseur' OR type =  'Sous-traitant'", function (error, fournisseurs, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        //console.log(fournisseurs);
        deferred.resolve(fournisseurs);
    });
    return deferred.promise;
}

function getAllCategories() {
    var deferred = Q.defer();
    db.query("SELECT * FROM produit_categorie", function (error, categories, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        //console.log(fournisseurs);
        deferred.resolve(categories);
    });
    return deferred.promise;
}

function getAllUnite() {
    var deferred = Q.defer();
    db.query("SELECT * FROM cat_unite", function (error, unites, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        //console.log(fournisseurs);
        deferred.resolve(unites);
    });
    return deferred.promise;
}

function getAllProdComp() {
    var deferred = Q.defer();
    db.query('SELECT * FROM produit_compose', function (error, prd_comp, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(prd_comp);
    });
    return deferred.promise;
}

function updateModif(modifParams) {

    //console.log("updatemdif service");
    var deferred = Q.defer();
    var params = [
        modifParams.id_produit,
        modifParams.id_contact
    ];

    var query = "INSERT INTO produit_histo (id_produit, id_contact, date_histo) VALUES (?, ?, NOW())";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            // console.log("error in create modif service");
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function getAllHisto(_id) {
    // console.log("histo service " + _id);
    var deferred = Q.defer();
    db.query('SELECT * FROM produit\
    JOIN users ON produit.id_user = users.id\
    WHERE produit.id_produit = ?\
    ORDER BY produit.num_version DESC'
        , [_id], function (error, histo, fields) {
            if (error) deferred.reject(error.name + ': ' + error.message);

            deferred.resolve(histo);
            //console.log("histos: " + JSON.stringify(histo));
        });
    return deferred.promise;

}


function addMat(matParam) {
    var params;
    var deferred = Q.defer();
    console.log(matParam);
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

    var query = "INSERT INTO vehiculemateriel (libelle,marque,vehimate,energie,type,annee,datectrltech,immatriculation,genre,date1ctrl,carrosserie,puissance,pl_ass,nserie,poidstc,poidsvide,bruit,regmot,remarque,dateachat,datevente,visite_ampliroll,visite_grue,pneu_av,pneu_ar,gps,code_poste,largeur,surface,gr,ncartegr,date_depreciation,ntelepeage,geolocalisation,poidstr,fgarant,dgarant) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log("error in addMat service :" + error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

function getAllVehimat() {
    var deferred = Q.defer();
    db.query('SELECT  `id_vehmat`,`libelle`,`marque`,`immatriculation`,`nserie`,`type`,`vehimate`,`annee`\
    FROM vehiculemateriel \ ORDER BY libelle \ ASC ', function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        //console.log(produits);
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getByIdvehmat(_id_vehmat) {
    var deferred = Q.defer();
    var sql = "SELECT * FROM vehiculemateriel WHERE id_vehmat = ?";
    var inserts = [_id_vehmat];
    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, product, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function updatevehmat(id_vehmat, matParam) {
    console.log("updating mat service");
    console.log(matParam);
    var deferred = Q.defer();

    var params = [
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
        id_vehmat
    ];

    var query = "UPDATE vehiculemateriel SET libelle=?,marque=?,vehimate=?,energie=?,type=?,annee=?,datectrltech=?,immatriculation=?,genre=?,date1ctrl=?,carrosserie=?,puissance=?,pl_ass=?,nserie=?,poidstc=?,poidsvide=?,bruit=?,regmot=?,remarque=?,dateachat=?,datevente=?,visite_ampliroll=?,visite_grue=?,pneu_av=?,pneu_ar=?,gps=?,code_poste=?,largeur=?,surface=?,gr=?,ncartegr=?,date_depreciation=?,ntelepeage=?,geolocalisation=?,poidstr=?,fgarant=?,dgarant=? WHERE id_vehmat = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });
    return deferred.promise;
}

function getByIdmat(_id_vehmat) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT * FROM vehiculemateriel WHERE id_vehmat = ?";
    var inserts = [_id_vehmat];

    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, product, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function deletemat(_id_vehmat) {
    console.log("DELETE FROM vehiculemateriel WHERE id_vehmat = ? ", [_id_vehmat]);
    var deferred = Q.defer();
    db.query("DELETE FROM vehiculemateriel WHERE id_vehmat = ? ", [_id_vehmat], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}

function getByIdEntretien(_id_vehmat) {
    var deferred = Q.defer();
    var sql = "SELECT  * FROM entretien WHERE id_vehmat = ?";
    var inserts = [_id_vehmat];
    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, product, fields) {
        if (error) {
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function getByIdEntretien1(_id_vehmat) {
    var deferred = Q.defer();
    var sql = "SELECT  * FROM entretien WHERE id_vehmat = ?";
    var inserts = [_id_vehmat];
    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, product, fields) {
        if (error) {
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function getAllRef(reference) {
    //console.log('test');
    var deferred = Q.defer();
    var sql = "SELECT reference FROM produit WHERE reference = ?";
    var inserts = [reference];

    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, product, fields) {
        if (error) {
            //console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(product);
    });
    return deferred.promise;
}

function addEntretien(EParams, id_vehmat) {
    var deferred = Q.defer();
    console.log("test1");

    var params = [
        EParams.date,
        EParams.motif,
        EParams.tarif,
        id_vehmat
    ];

    var query = "INSERT INTO entretien (date, motif, tarif,id_vehmat) VALUES (? , ? , ?, ?)";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            //console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }

        console.log(results);
        deferred.resolve(results);

    });

    return deferred.promise;
}

function deleteEntre(_id_entretien) {
    console.log("DELETE FROM entretien WHERE id_entretien = ? ", [_id_entretien]);
    var deferred = Q.defer();
    db.query("DELETE FROM entretien WHERE id_entretien = ? ", [_id_entretien], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}
