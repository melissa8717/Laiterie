var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var service = {};

service.getAll = getAll;
service.getList = getList;
service.create = create;
service.getById = getById;
service.update = update;
service.delete = _delete;

service.createAdresse = createAdresse;
service.getAdresseById = getAdresseById;
service.updateAdresse = updateAdresse;
service.deleteAdresseById = deleteAdresseById;


service.createMail = createMail;
service.getMailsById = getMailsById;
service.updateMail = updateMail;
service.deleteMailsById = deleteMailsById;

service.createTelephone = createTelephone;
service.getTelephonesById = getTelephonesById;
service.updateTelephone = updateTelephone;
service.deleteTelephonesById = deleteTelephonesById;

service.createContrat = createContrat;
service.getContratsById = getContratsById;
service.updateContrat = updateContrat;
service.deleteContratsById = deleteContratsById;

service.linkContactQualification = linkContactQualification;
service.getQualifications = getQualifications;
service.getQualificationsById = getQualificationsById;
service.updateContactQualification = updateContactQualification;
service.deleteLinkQualification = deleteLinkQualification;

//byalex
service.getAllFournisseurs = getAllFournisseurs;
service.getAllOuvriers = getAllOuvriers;
service.getAllEquipes = getAllEquipes;
service.getAllEmploye = getAllEmploye;
service.getAllClients = getAllClients;
service.getAddress = getAddress;

service.getByIdchantier = getByIdchantier;
service.getByIdencours = getByIdencours;

service.getByIdContrat = getByIdContrat;
service.getByIdLastContrat = getByIdLastContrat;
service.addcontrat = addcontrat;
service.newcontrat = newcontrat;

service.getByIdDevisclient = getByIdDevisclient;
service.addForm = addForm;
service.getByIdNom = getByIdNom;

service.getAllform = getAllform;
service.getAllCaces = getAllCaces;
service.getByIdFormation = getByIdFormation;
service.deleteFormation = deleteFormation;
service.addCaces = addCaces;
service.getByIdCaces = getByIdCaces;
service.upCaces = upCaces;
service.upFormation = upFormation;


service.equipement = equipement;
service.getByIdequipement = getByIdequipement;
service.deleteEquipement = deleteEquipement;
service.deleteCaces = deleteCaces;

service.getByIdFacclient = getByIdFacclient;

service.addAdressfact = addAdressfact;
service.getByIdFacAddress = getByIdFacAddress;

module.exports = service;

/*******************************************************************************
 CONTACTS
 */

function getAllEmploye() {
    var deferred = Q.defer();
    db.query('SELECT * FROM contact where type = "Employé" ', function (error, contacts, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve(contacts);
    });
    return deferred.promise;
}

function getAllOuvriers() {
    var deferred = Q.defer();
    db.query('SELECT *, contact.id_contact  FROM contact ' +
        'LEFT JOIN ouvrier_equipe on ouvrier_equipe.id_contact = contact.id_contact ' +
        'LEFT JOIN equipe on equipe.id_equipe = ouvrier_equipe.id_equipe ' +
        'where type = "Ouvrier" ', function (error, contacts, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve(contacts);
    });
    return deferred.promise;
}

function getAllFournisseurs() {
    var deferred = Q.defer();
    db.query('SELECT * FROM contact where type = "Fournisseur" ', function (error, contacts, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve(contacts);
        //console.log(contacts);
    });
    return deferred.promise;
}

function getAllEquipes() {
    var deferred = Q.defer();
    db.query('SELECT * FROM equipe ', function (error, contacts, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve(contacts);
    });
    return deferred.promise;
}

function getAddress(id) {
    var deferred = Q.defer();
    db.query('SELECT * FROM adresse where id_contact = ? ', [id], function (error, address, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(address);
    });
    return deferred.promise;
}

function getAllClients() {
    var deferred = Q.defer();
    db.query('SELECT * FROM contact where type = "Client" ', function (error, contacts, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve(contacts);
        //console.log(contacts);
    });
    return deferred.promise;
}


function getAll() {
    var deferred = Q.defer();
    db.query('SELECT * FROM contact', function (error, contacts, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(contacts);
    });
    return deferred.promise;
}

function getList() {
    var deferred = Q.defer();
    db.query('SELECT * FROM ListeContacts group by id_contact', function (error, contacts, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(contacts);
    });
    return deferred.promise;
}

function create(contactParam) {

    var deferred = Q.defer();
    var query = "INSERT INTO contact VALUES (NULL";
    var params = [
        contactParam.nom,
        contactParam.prenom,
        contactParam.titre,
        contactParam.Date_naissance,
        contactParam.lieu_naissance,
        contactParam.n_identite,
        contactParam.n_secu,
        contactParam.n_permis,
        contactParam.raison_sociale,
        contactParam.siret,
        contactParam.APE,
        contactParam.id_caces,
        contactParam.poste,
        contactParam.chef_equipe,
        contactParam.type,
        contactParam.autorisation_conduite,
        contactParam.H0B0,
        contactParam.date_entree,
        contactParam.date_sortie,
        contactParam.secourisme,
        contactParam.validite_amiante,
        contactParam.travail_hauteur,
        contactParam.visite_medicale,
        contactParam.note,
        contactParam.contrat,
        contactParam.mutuelle,
        contactParam.site,
        contactParam.heuremois,
        contactParam.condition_generale,
        contactParam.condition_reg,
        contactParam.n_reg,
        contactParam.fonction,
        contactParam.image_url,
        contactParam.TVAintra,
        contactParam.user,
        contactParam.autres,
        contactParam.adresse,
        contactParam.ville,
        contactParam.code_postal,
        contactParam.equipe


    ];
    for (var i in params) {
        query += ", ?";
    }
    query += ")";

    db.query(query, params, function (error, result, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        //console.log(error.name + ': ' + error.message);

        deferred.resolve(result);
    });

    return deferred.promise;
}

function getById(_id) {

    var deferred = Q.defer();

    db.query("SELECT id_contact, nom, prenom, titre, lieu_naissance, n_identite, n_secu, n_permis, raison_sociale, siret, APE, id_caces, poste, chef_equipe, type, autorisation_conduite, note, contrat, mutuelle, site, heuremois, condition_reg, n_reg, condition_generale, fonction, image_url, TVAintra, user, autre, adresse, ville, code_postal, equipe, " +
        "DATE_ADD (Date_naissance, INTERVAL 1 HOUR) AS Date_naissance, " +
        "DATE_ADD (H0B0, INTERVAL 1 HOUR) AS H0B0, " +
        "DATE_ADD (date_entree, INTERVAL 1 HOUR) AS date_entree, " +
        "DATE_ADD (date_sortie, INTERVAL 1 HOUR) AS date_sortie, " +
        "DATE_ADD (secourisme, INTERVAL 1 HOUR) AS secourisme, " +
        "Date_ADD (validite_amiante, INTERVAL 1 HOUR) AS validite_amiante, " +
        "DATE_ADD (travail_hauteur, INTERVAL 1 HOUR) AS travail_hauteur, " +
        "Date_ADD (visite_medicale, INTERVAL 1 HOUR) AS visite_medicale " +
        "FROM contact WHERE id_contact = ?", [_id], function (error, user, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(user);
    });
    return deferred.promise;

}


function update(contactParam) {

    var deferred = Q.defer();
console.log(contactParam.date_entree);
console.log(contactParam.Date_naissance);
//var new_date_entree = new Date(contactParam.date_entree).toISOString();
//console.log(new_date_entree);

    var params = [
        contactParam.nom,
        contactParam.prenom,
        contactParam.titre,
        contactParam.Date_naissance,
        contactParam.lieu_naissance,
        contactParam.n_identite,
        contactParam.n_secu,
        contactParam.n_permis,
        contactParam.raison_sociale,
        contactParam.siret,
        contactParam.APE,
        contactParam.id_caces,
        contactParam.poste,
        contactParam.chef_equipe,
        contactParam.type,
        contactParam.autorisation_conduite,
        contactParam.H0B0,
        contactParam.date_entree,
        contactParam.date_sortie,
        contactParam.secourisme,
        contactParam.validite_amiante,
        contactParam.travail_hauteur,
        contactParam.visite_medicale,
        contactParam.note,
        contactParam.contrat,
        contactParam.mutuelle,
        contactParam.site,
        contactParam.heuremois,
        contactParam.condition_generale,
        contactParam.condition_reg,
        contactParam.n_reg,
        contactParam.fonction,
        contactParam.image_url,
        contactParam.TVAintra,
        contactParam.user,
        contactParam.autre,
        contactParam.adresse,
        contactParam.ville,
        contactParam.code_postal,
        contactParam.equipe,
        contactParam.id_contact
    ];

    var query = "UPDATE contact SET nom=?, prenom=?, titre=?, Date_naissance=?, lieu_naissance=?, n_identite=?, n_secu=?, n_permis=?, raison_sociale=?, siret=?, APE=?, id_caces=?, poste=?, chef_equipe=?, type=?, autorisation_conduite=?, H0B0=?, date_entree=?, date_sortie=?, secourisme=?, validite_amiante=?, travail_hauteur=?, visite_medicale=?, note=?, contrat=?, mutuelle=?, site=?, heuremois=?, condition_generale=?, condition_reg=?, n_reg=?, fonction=?, image_url=?, TVAintra=?, user=?, autre=?, adresse=?, ville=?, code_postal=?, equipe=? WHERE id_contact = ?";
    //var query = "UPDATE contact SET nom=?, prenom=?, Date_naissance=?, H0B0=?, date_entree=?, date_sortie=? WHERE id_contact = ?";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log('MySql ERROR trying to update user informations (3) | ' + error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        deferred.resolve();
    });
    return deferred.promise;
}

/*
function update(contactParam) {
    console.log(contactParam);
    console.log(contactParam.id_contact);
    var deferred = Q.defer();
    var query = "UPDATE contact SET ";
    var params = [];

    for(var i in contactParam){
        query += i+" = ?, ";
        params.push(contactParam[i]);
    }
    query = query.substring(0, query.length-2);
    query += " WHERE id_contact = ?";
    params.push(contactParam.id_contact);

    db.query(query, params, function (error, result, fields) {
        if (error) deferred.reject(error.name + ': [updateContact] ' + error.message);

        deferred.resolve();
    });

    return deferred.promise;
} */

function _delete(_id) {
    var deferred = Q.defer();
    db.query("DELETE FROM contact WHERE id_contact = ? ", [_id], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        deferred.resolve();
    });

    return deferred.promise;
}

/*************************************************************
 * ADRESSE
 */

function createAdresse(adresse) {
    var deferred = Q.defer();

    if (!adresse.adresse)
        deferred.resolve();
    else {
        db.query("INSERT INTO adresse VALUES (NULL, ? , ? , ?,?,?,?,?)", [adresse.id_contact, adresse.adresse, adresse.code_postal, adresse.ville, adresse.type_adr, adresse.user, adresse.autre], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });
    }

    return deferred.promise;
}


function getAdresseById(id_contact) {
    var deferred = Q.defer();
    db.query('SELECT * FROM adresse WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function updateAdresse(adresse) {
    var deferred = Q.defer();

    if (!adresse.adresse || adresse.adresse == "") {
        db.query('DELETE FROM adresse WHERE id_contact = ? AND adresse = ?', [adresse.id_contact, adresse.adresse], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': [updateadressel 1] ' + error.message);

            deferred.resolve();
        });
    } else {
        db.query("SELECT * FROM adresse WHERE id_contact = ? AND adresse = ?", [adresse.id_contact, adresse.adresse], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': [updateMail 2] ' + error.message);

            if (results.length > 0) {
                db.query("UPDATE adresse SET adresse = ? WHERE id_contact = ? AND adresse = ?", [adresse.adresse, adresse.id_contact], function (error, results, fields) {
                    if (error) deferred.reject(error.name + ': [updateadresse 3] ' + error.message);

                    deferred.resolve();
                });
            } else {
                db.query("INSERT INTO adresse VALUES (NULL, ? , ? )", [adresse.id_contact, adresse.adresse], function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }
                    deferred.resolve();
                });
            }
        });
    }

    return deferred.promise;
}

function deleteAdresseById(id_contact) {
    var deferred = Q.defer();
    db.query('DELETE FROM adresse WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve();
    });
    return deferred.promise;
}

/*******************************************************************************
 MAILS
 */
function createMail(mail) {
    var deferred = Q.defer();

    if (!mail.mail)
        deferred.resolve();
    else {
        db.query("INSERT INTO mail VALUES (NULL, ? , ? , ?)", [mail.id_contact, mail.mail, mail.type_mail], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function getMailsById(id_contact) {
    var deferred = Q.defer();
    db.query('SELECT * FROM mail WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function updateMail(mail) {
    var deferred = Q.defer();

    if (!mail.mail || mail.mail == "") {
        db.query('DELETE FROM mail WHERE id_contact = ? AND type_mail = ?', [mail.id_contact, mail.type_mail], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': [updateMail 1] ' + error.message);

            deferred.resolve();
        });
    } else {
        db.query("SELECT * FROM mail WHERE id_contact = ? AND type_mail = ?", [mail.id_contact, mail.type_mail], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': [updateMail 2] ' + error.message);

            if (results.length > 0) {
                db.query("UPDATE mail SET mail = ? WHERE id_contact = ? AND type_mail = ?", [mail.mail, mail.id_contact, mail.type_mail], function (error, results, fields) {
                    if (error) deferred.reject(error.name + ': [updateMail 3] ' + error.message);

                    deferred.resolve();
                });
            } else {
                db.query("INSERT INTO mail VALUES (NULL, ? , ? , ?)", [mail.id_contact, mail.mail, mail.type_mail], function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }
                    deferred.resolve();
                });
            }
        });
    }

    return deferred.promise;
}

function deleteMailsById(id_contact) {
    var deferred = Q.defer();
    db.query('DELETE FROM mail WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve();
    });
    return deferred.promise;
}

/*******************************************************************************
 TELEPHONES
 */
function createTelephone(tel) {
    var deferred = Q.defer();

    if (!tel.numero)
        deferred.resolve();
    else {
        db.query("INSERT INTO telephone VALUES (NULL, ? , ? , ?,?,?)", [tel.id_contact, tel.numero, tel.type_tel, tel.user, tel.autre], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function getTelephonesById(id_contact) {
    var deferred = Q.defer();
    db.query('SELECT * FROM telephone WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function updateTelephone(tel) {
    var deferred = Q.defer();

    if (!tel.numero || tel.numero == "") {
        db.query('DELETE FROM telephone WHERE id_contact = ? AND type_tel = ?', [tel.id_contact, tel.type_tel], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': [updateTelephone 1] ' + error.message);

            deferred.resolve();
        });
    } else {
        db.query("SELECT * FROM telephone WHERE id_contact = ? AND type_tel = ?", [tel.id_contact, tel.type_tel], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': [updateTelephone 2] ' + error.message);

            if (results.length > 0) {
                db.query("UPDATE telephone SET numero = ? WHERE id_contact = ? AND type_tel = ?", [tel.numero, tel.id_contact, tel.type_tel], function (error, results, fields) {
                    if (error) deferred.reject(error.name + ': [updateTelephone 3] ' + error.message);

                    deferred.resolve();
                });
            } else {
                db.query("INSERT INTO telephone VALUES (NULL, ? , ? , ?,?,?)", [tel.id_contact, tel.numero, tel.type_tel, tel.user, tel.autre], function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }
                    deferred.resolve();
                });
            }
        });
    }

    return deferred.promise;
}

function deleteTelephonesById(id_contact) {
    var deferred = Q.defer();
    db.query('DELETE FROM telephone WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve();
    });
    return deferred.promise;
}


/*******************************************************************************
 CONTRATS
 */
function createContrat(contrat) {
    var deferred = Q.defer();

    if (!contrat.contrat || !contrat.date_sortie || !contrat.date_entree)
        deferred.resolve();
    else {
        db.query("INSERT INTO contrat_histo VALUES (NULL, ? , ? , ?, ?)", [contrat.id_contact, contrat.date_entree, contrat.date_sortie, contrat.contrat], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }

            db.query("UPDATE contact SET contrat = NULL, date_sortie = NULL WHERE id_contact = ? ", [contrat.id_contact], function (error, results, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                }
                deferred.resolve();
            });
        });
    }

    return deferred.promise;
}

function getContratsById(id_contact) {
    var deferred = Q.defer();
    db.query('SELECT * FROM contrat_histo WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function updateContrat(id_contact, contrat) {
    var deferred = Q.defer();

    if (!contrat.contrat || contrat.contrat == "" ||
        !contrat.date_sortie || contrat.date_sortie == "" ||
        !contrat.date_entree || contrat.date_entree == "" ||
        !contrat.type_contrat || contrat.type_contrat == "")
        deferred.resolve();
    else {
        db.query("INSERT INTO contrat_histo VALUES (NULL, ? , ? , ?, ?,?)", [contrat.id_contact, contrat.date_entree, contrat.date_sortie, contrat.contrat, contrat.type_contrat], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': [updateContrat] ' + error.message);
            }

            contrat.contrat = null;
            contrat.date_sortie = null;
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function deleteContratsById(id_contact) {
    var deferred = Q.defer();
    db.query('DELETE FROM contrat_histo WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve();
    });
    return deferred.promise;
}


/*******************************************************************************
 QUALIFICATIONS
 */
function getQualifications() {
    var deferred = Q.defer();
    db.query('SELECT * FROM qualification', function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function linkContactQualification(id_contact, id_qualification) {
    var deferred = Q.defer();

    if (!id_qualification)
        deferred.resolve();
    else {
        db.query("INSERT INTO statut_employe VALUES (? , ?)", [id_contact, id_qualification], function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function getQualificationsById(id_contact) {
    var deferred = Q.defer();
    db.query('SELECT * FROM statut_employe WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(results);
    });
    return deferred.promise;
}

function updateContactQualification(id_contact, qualif) {
    var deferred = Q.defer();

    if (!qualif || qualif == "") {
        db.query('DELETE FROM statut_employe WHERE id_contact = ?', [id_contact], function (error, results, fields) {
            if (error) deferred.reject(error.name + ': [updateContactQualification 1] ' + error.message);

            deferred.resolve();
        });
    } else {
        db.query("SELECT * FROM statut_employe WHERE id_contact = ?", [id_contact], function (error, results, fields) {
            if (error) deferred.reject(error.name + ' : [updateContactQualification 2] ' + error.message);

            if (results.length > 0) {
                db.query("UPDATE statut_employe SET id_qualification = ? WHERE id_contact = ? ", [qualif, id_contact], function (error, results, fields) {
                    if (error) deferred.reject(error.name + ' : [updateContactQualification 3] ' + error.message);

                    deferred.resolve();
                });
            } else {
                db.query("INSERT INTO statut_employe VALUES (? , ?)", [id_contact, qualif], function (error, results, fields) {
                    if (error) {
                        deferred.reject(error.name + ': ' + error.message);
                    }
                    deferred.resolve();
                });
            }
        });
    }

    return deferred.promise;
}

function deleteLinkQualification(id_contact) {
    var deferred = Q.defer();
    db.query('DELETE FROM statut_employe WHERE id_contact = ?', [id_contact], function (error, results, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve();
    });
    return deferred.promise;
}

/*----------------------------fiche client-----------------------------*/
function getByIdchantier(_id_contact) {
    var deferred = Q.defer();
    var sql = "SELECT contact.id_contact, chantier.reception_chantier, chantier.id_chantier, chantier.nom_chantier,listchantierfacturemois . * " +
        "FROM chantier, contact, chantierdevis, devis_version, listchantierfacturemois " +
        "WHERE contact.id_contact =? " +
        "AND contact.id_contact = chantier.id_contact " +
        "AND (chantierdevis.id_chantier = chantier.id_chantier AND chantierdevis.status = 'terminé') " +
        "AND devis_version.id_devis = chantierdevis.id_devis " +
        "AND devis_version.num_version = chantierdevis.num_version " +
        "AND chantierdevis.id_chantier = listchantierfacturemois.id_chantier " +
        "GROUP BY chantierdevis.id_chantier";
    var inserts = [_id_contact];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdencours(_id_contact) {

    var deferred = Q.defer();
    var sql = "SELECT chantier.id_chantier, chantier.nom_chantier,chantierdevis.id_devis,chantierdevis.num_version " +
        "FROM chantier, chantierdevis, contact " +
        "WHERE contact.id_contact = ? " +
        "AND chantier.id_contact = contact.id_contact " +
        "AND chantier.id_chantier = chantierdevis.id_chantier " +
        "AND chantierdevis.status = 'en cours' ";
    var inserts = [_id_contact];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

/*********************fiche contact****************************/

function getByIdContrat(_id_contact) {

    var deferred = Q.defer();
    var sql = "SELECT * " +
        "FROM contrat_histo " +
        "WHERE id_contact = ? ";
    var inserts = [_id_contact];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function getByIdLastContrat(_id_contact) {

    var deferred = Q.defer();
    var sql = "SELECT * " +
        "FROM contrat_histo " +
        "WHERE id_contact = ? " +
        "ORDER BY id_contrat DESC ";
    var inserts = [_id_contact];
    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}

function addcontrat(contrat_param) {
    var deferred = Q.defer();

console.log(contrat_param);
    db.query("INSERT INTO contrat_histo (id_contact,date_debut, date_fin,type_contrat,tauxhoraire,tauxhorairesbrute,tauxsurcharge,panier,heure_mois,agence_interim,id_interim) VALUES ( ? , ? , ? , ?,?,?,?,?,?,?,? )",
        [contrat_param.id_contact, contrat_param.date_debut, contrat_param.date_fin, contrat_param.type_contrat, contrat_param.tauxhoraire, contrat_param.tauxhorairesbrute, contrat_param.tauxsurcharge, contrat_param.panier, contrat_param.heure_mois,  contrat_param.agence_interim, contrat_param.id_interim],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });

    return deferred.promise;
}

function newcontrat(contrat_param, id_contact) {
    var deferred = Q.defer();


    db.query("INSERT INTO contrat_histo (id_contact,date_debut, date_fin,type_contrat,tauxhoraire,tauxhorairesbrute,tauxsurcharge,panier,heure_mois,agence_interim,id_interim) VALUES ( ? , ? , ? , ?,?,?,?,?,?,?,?)",
        [id_contact, contrat_param.date_debut, contrat_param.date_fin, contrat_param.type_contrat, contrat_param.tauxhoraire, contrat_param.tauxhorairesbrute, contrat_param.tauxsurcharge, contrat_param.panier, contrat_param.heure_mois, contrat_param.agence_interim, contrat_param.id_interim],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve();
        });

    return deferred.promise;
}

/**************************************************************devis client*************************************************************************/

function getByIdDevisclient(_id_contact) {

    var deferred = Q.defer();
    var sql = "SELECT devis_version. * , contact.nom, devis.ville, devis.nom_chantier " +
        "FROM contact, devis, devis_version " +
        "WHERE contact.id_contact = devis.id_contact " +
        "AND contact.id_contact =? " +
        "AND devis_version.id_devis = devis.id_devis ";
    var inserts = [_id_contact];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}


/*******************************************************************Formation contact***************************************************************************************/

function getByIdNom(id_contact) {

    var deferred = Q.defer();

    db.query("SELECT id_contact,nom,prenom FROM contact WHERE id_contact = ?", [id_contact], function (error, user, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(user);
    });
    return deferred.promise;

}

//formation::::

function addForm(Eparams) {
    var deferred = Q.defer();
    //console.log(Eparams);

    db.query("INSERT INTO formationcontact (id_contact, nom_formation, datefor,id_formation) VALUES (? , ? , ? ,?)", [Eparams.nom.id_contact, Eparams.test.nom_formation.designation, Eparams.test.datefor, Eparams.test.nom_formation.id_formation], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
    });
    return deferred.promise;
}


function getAllform() {
    var deferred = Q.defer();
    db.query("SELECT * FROM formation", function (error, produits, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            //console.log(error.name + ': ' + error.message);
        }
        //console.log(produits);
        deferred.resolve(produits);
    });
    return deferred.promise;
}

function getByIdFormation(id_contact) {

    var deferred = Q.defer();

    db.query("SELECT * FROM formationcontact WHERE id_contact = ?", [id_contact], function (error, user, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(user);
    });
    return deferred.promise;

}

function deleteFormation(id_formationcontact) {
    var deferred = Q.defer();
    db.query("DELETE FROM formationcontact WHERE id_formationcontact = ? ", [id_formationcontact], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}


///CACES::::

function getAllCaces() {
    var deferred = Q.defer();
    db.query('SELECT * FROM `caces` ', function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(results);
        deferred.resolve(results);
    });
    return deferred.promise;
}

function addCaces(Eparams) {
    var deferred = Q.defer();
    //console.log("test1");
    //console.log(Eparams);

    db.query("INSERT INTO cacescontact(id_contact, date_fin,id_caces) VALUES (? , ? , ? )", [Eparams.nom.id_contact, Eparams.facting.date_fin, Eparams.facting.cacess.id_caces], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log("(2)" + error.name + ': ' + error.message);
        }
    });
    return deferred.promise;
}

function getByIdCaces(id_contact) {

    var deferred = Q.defer();

    db.query("SELECT * FROM cacescontact,caces  WHERE id_contact = ? AND cacescontact.id_caces = caces.id_caces", [id_contact], function (error, user, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(user);
    });
    return deferred.promise;

}

function upCaces(eParam) {

    var deferred = Q.defer();

    var params = [
        eParam.date_fin,
        eParam.id_cacon

    ];

    var query = "UPDATE cacescontact SET date_fin=? WHERE id_cacon = ?  ";
    //console.log(query, params)
    db.query(query, params, function (error, results, fields) {
        if (error) {
            //console.log(+ error.message)
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }
        //console.log(results)

        deferred.resolve();
    });
    return deferred.promise;
}

function deleteCaces(id_cacon) {
    var deferred = Q.defer();
    db.query("DELETE FROM cacescontact WHERE id_cacon= ? ", [id_cacon], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}

function upFormation(eParam) {

    var deferred = Q.defer();

    var params = [
        eParam.datefor,
        eParam.id_formationcontact

    ];

    var query = "UPDATE formationcontact SET datefor=? WHERE id_formationcontact = ?  ";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            //console.log(+ error.message)
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(results)

        deferred.resolve();
    });
    return deferred.promise;
}


function equipement(equipement, id_contact) {
    var deferred = Q.defer();
    //console.log(equipement);

    db.query("INSERT INTO equipement(id_contact,designation,nbre,taille,commentaire,date) VALUES (? , ?,?,?,?,?)", [id_contact, equipement.designation, equipement.nbre, equipement.taille, equipement.commentaire, equipement.date], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve();
    });

    return deferred.promise;
}

function getByIdequipement(id_contact) {

    var deferred = Q.defer();

    db.query("SELECT * FROM equipement  WHERE id_contact = ? ", [id_contact], function (error, user, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve(user);
    });
    return deferred.promise;

}

function deleteEquipement(id_equipement) {
    var deferred = Q.defer();
    db.query("DELETE FROM equipement WHERE id_equipement = ? ", [id_equipement], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}


function getByIdFacclient(_id_contact) {

    var deferred = Q.defer();
    var sql = "SELECT contact.nom, contact.prenom, devis.*, facture . * \n" +
        "FROM facture, contact\n" +
        "LEFT JOIN devis ON devis.id_contact = contact.id_contact\n" +
        "WHERE contact.id_contact =165\n" +
        "AND facture.id_devis = devis.id_devis ORDER BY facture.id_facture DESC";
    var inserts = [_id_contact];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}


function addAdressfact(EParams, id_contact) {
    console.log(EParams, id_contact);
    let deferred = Q.defer();

    let params = [
        id_contact,
        EParams.adresse,
        EParams.complement_adr,
        EParams.code_postale,
        EParams.ville,
        EParams.pays
    ];

    let query = "INSERT INTO adresse (id_contact,adresse, complement_adr, code_postal,ville, pays,  type_adr) VALUES (? , ? , ?, ?, ? ,? ,'Facturation' )";

    db.query(query, params, function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}


function getByIdFacAddress(_id_contact) {

    let deferred = Q.defer();
    let sql = "SELECT * FROM  `adresse` WHERE id_contact =? AND type_adr =  'Facturation' ";
    let inserts = [_id_contact];
    sql = mysql.format(sql, inserts);
    //console.log(sql);
    db.query(sql, function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message)
            deferred.reject(error.name + ': ' + error.message);
        }

        deferred.resolve(results);
    });
    return deferred.promise;
}