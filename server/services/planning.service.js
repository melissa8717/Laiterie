/**
 * Created by Wbat on 07/08/2017.
 */
var Q = require('q');
var mysql = require('mysql');
var db = require('../db.js').get();

var isToday = require('date-fns/is_today');
var isBefore = require('date-fns/is_before');
var addDays = require('date-fns/add_days');

var service = {};
service.getAll = getAll;
service.getAllTravail = getAllTravail;
service.getAlarms = getAlarms;
service.create = create;
service.addEmployeEvents = addEmployeEvents;
service.addTeamEvents = addTeamEvents;
service.update = update;
service.validate = validate;
service.validateTeam = validateTeam;
service._delete = _delete;
service._deleteTravail = _deleteTravail;
service._deleteTravailEquipe = _deleteTravailEquipe;
service.updateplanning_simple = updateplanning_simple;
service.addEquipe = addEquipe;
service.deleteEquipe = deleteEquipe;
service.getAllEquipe = getAllEquipe;

service.getAllRecap = getAllRecap;
service.getAllHeuresem = getAllHeuresem;
service.upouvrier = upouvrier;

service.getAllEquipeouvrier = getAllEquipeouvrier;
service.getAllouvrier = getAllouvrier;
service.addWorker = addWorker;
service.getAllNamechantier = getAllNamechantier;

module.exports = service;


function addEmployeEvents(eventparams) {
    var deferred = Q.defer();

    var deb = new Date(eventparams.deb);
    var fin = new Date(eventparams.fin);

    for (deb; isBefore(new Date(deb), new Date(fin)); deb = addDays(deb, 1)) {


        db.query('INSERT INTO travail (nb_heure, date, id_employé, id_chantier, type) VALUES ( ?, ?, ?, ?, ?)',
            [eventparams.nb_heure, deb, eventparams.employe.id_contact, eventparams.chantier.id_chantier, eventparams.type],
            function (error, rdv, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                    console.log(error.name + ': ' + error.message);

                }
            });

    }

    db.query('INSERT INTO travail (nb_heure, date, id_employé, id_chantier, type) VALUES ( ?, ?, ?, ?, ?)',
        [eventparams.nb_heure, deb, eventparams.employe.id_contact, eventparams.chantier.id_chantier, eventparams.type],
        function (error, rdv, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);

            }
            deferred.resolve();

        });


    return deferred.promise;
}

function addTeamEvents(eventparams) {
    var deferred = Q.defer();
    var deb = new Date(eventparams.deb);
    var fin = new Date(eventparams.fin);

    for (deb; isBefore(new Date(deb), new Date(fin)); deb = addDays(deb, 1)) {


        db.query('INSERT INTO travail_equipe (nb_heure, date, id_equipe, id_chantier, type) VALUES ( ?, ?, ?, ?, ?)',
            [eventparams.nb_heure, deb, eventparams.equipe.id_equipe, eventparams.chantier.id_chantier, eventparams.type],
            function (error, rdv, fields) {
                if (error) {
                    deferred.reject(error.name + ': ' + error.message);
                    console.log(error.name + ': ' + error.message);

                }
            });

    }

    db.query('INSERT INTO travail_equipe (nb_heure, date, id_equipe, id_chantier, type) VALUES ( ?, ?, ?, ?, ?)',
        [eventparams.nb_heure, deb, eventparams.equipe.id_equipe, eventparams.chantier.id_chantier, eventparams.type],
        function (error, rdv, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);

            }
            deferred.resolve();

        });
    return deferred.promise;
}


function getAlarms() {
    var deferred = Q.defer();
    db.query('SELECT contact.*, chantier.* , event.*, event.type FROM event ' +
        'LEFT JOIN contact on contact.id_contact = event.id_contact ' +
        'LEFT JOIN chantier on chantier.id_chantier = event.id_chantier where event.start >= NOW() - INTERVAL + 2 HOUR ORDER BY event.start', function (error, rdv, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);

        //console.log(rdv)
        deferred.resolve(rdv);
    });
    return deferred.promise;
}


function getAllTravail() {
    var deferred = Q.defer();
    db.query('SELECT travail . * , chantier.nom_chantier from travail LEFT JOIN chantier ON chantier.id_chantier = travail.id_chantier', function (error, solo, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        //console.log(rdv)

        db.query('SELECT * from travail_equipe', function (error, equipe, fields) {
            if (error) deferred.reject(error.name + ': ' + error.message);
            var rdv = [];
            var test = {};
            test.solo = solo;
            test.equipe = equipe;
            rdv.push(test);
            deferred.resolve(rdv);
        });

    });
    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    db.query('SELECT contact.*, chantier.* , event.*, event.type FROM event ' +
        'LEFT JOIN contact on contact.id_contact = event.id_contact ' +
        'LEFT JOIN chantier on chantier.id_chantier = event.id_chantier ', function (error, rdv, fields) {
        if (error) deferred.reject(error.name + ': ' + error.message);
        for (var i = 0; i < rdv.length; i++) {
            rdv[i].color = {
                primary: rdv[i].primaire,
                secondary: rdv[i].secondary
            };

            rdv[i].employe = {
                nom: rdv[i].nom,
                id_contact: rdv[i].id_contact,
                prenom: rdv[i].prenom
            };

            rdv[i].chantier = rdv[i].id_chantier ? {
                nom_chantier: rdv[i].nom_chantier,
                id_chantier: rdv[i].id_chantier
            } : null;

        }
        //console.log(rdv)
        deferred.resolve(rdv);
    });
    return deferred.promise;
}

function _deleteTravail(_id) {
    var deferred = Q.defer();

    db.query("DELETE FROM travail WHERE id_travail = ?", [_id], function (error, result, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }

        console.log(result);
        deferred.resolve();
    });

    return deferred.promise;
}

function _deleteTravailEquipe(_id) {
    var deferred = Q.defer();

    db.query("DELETE FROM travail_equipe WHERE id_travail = ?", [_id], function (error, result, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        console.log(result);
        deferred.resolve();
    });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();


    db.query("DELETE FROM event WHERE id_event = ?", [_id], function (error, result, fields) {
        if (error) {

            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }

        deferred.resolve();
    });

    return deferred.promise;
}


function update(id, eventparams) {
    var deferred = Q.defer();


    db.query("UPDATE event SET start = ?, end = ?, title = ?, type = ?, id_contact = ?, id_chantier = ? WHERE id_event = ? ",
        [eventparams.start, eventparams.end, eventparams.title, eventparams.type, eventparams.employe.id_contact, (eventparams.chantier ? eventparams.chantier.id_chantier : null), id], function (error, result, fields) {
            if (error) {

                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            deferred.resolve();
        });


    deferred.resolve();

    return deferred.promise;
}


function validate(id, eventparams) {
    var deferred = Q.defer();

    db.query("UPDATE travail SET nb_heure = ?,type=?, valid = true WHERE id_travail = ? ",
        [eventparams.nb_heure, eventparams.type, id], function (error, result, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            deferred.resolve();
        });


    deferred.resolve();

    return deferred.promise;
}

function validateTeam(id, eventparams) {
    var deferred = Q.defer();

    db.query("UPDATE travail_equipe SET nb_heure = ?,type=?, valid = true WHERE id_travail = ? ",
        [eventparams.nb_heure, eventparams.type, id], function (error, result, fields) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            deferred.resolve();
        });


    deferred.resolve();

    return deferred.promise;
}

function create(eventParam) {
    var deferred = Q.defer();
    var query = "INSERT INTO event (start, end, title, type, id_contact, id_chantier, primaire, secondary) VALUES (?,?,?,?,?,?,?,?)";
    var params = [
        eventParam.start,
        eventParam.end,
        eventParam.title,
        eventParam.type,
        eventParam.employe.id_contact,
        eventParam.chantier ? eventParam.chantier.id_chantier : null,
        eventParam.color.primary,
        eventParam.color.secondary
    ];
    /* for(var i = 0 ; i < params.length - 1; i++){
     query += " ? , ";
     }
     query += "? )";*/
    //console.log(query);
    //console.log(params);
    sql = mysql.format(query, params);
    //console.log(sql);

    db.query(query, params, function (error, result, fields) {
        if (error) {

            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }

        deferred.resolve(result.insertId);
    });

    return deferred.promise;
}


function updateplanning_simple(id, eventparams) {
    var deferred = Q.defer();

    db.query("UPDATE event SET start = ?, end = ?, title = ?, type = ?, id_contact = ?, id_chantier = ? WHERE id_event = ? ",
        [eventparams.start, eventparams.end, eventparams.title, eventparams.type, eventparams.employe.id_contact, (eventparams.chantier ? eventparams.chantier.id_chantier : null), id], function (error, result, fields) {
            if (error) {

                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }

            deferred.resolve();
        });


    deferred.resolve();

    return deferred.promise;
}

function addEquipe(EParams, id_equipe) {
    var deferred = Q.defer();

    var params = [
        EParams.n_equipe,
        EParams.couleur,
        id_equipe
    ];

    var query = "INSERT INTO equipe (n_equipe, couleur,id_equipe) VALUES ( ? , ?, ?)";

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

function deleteEquipe(_id_equipe) {
    console.log("DELETE FROM equipe WHERE id_equipe = ? ", [_id_equipe]);
    var deferred = Q.defer();
    db.query("DELETE FROM equipe WHERE id_equipe = ? ", [_id_equipe], function (error, results, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);

        }
        deferred.resolve();
    });

    return deferred.promise;
}


function getAllEquipe() {
    var deferred = Q.defer();
    db.query('SELECT * FROM equipe', function (error, equipe, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        console.log(equipe);
        deferred.resolve(equipe);
    });
    return deferred.promise;
}


/**************************************recapitulatif mois *********************************************************/

function getAllRecap(month, year) {
    var deferred = Q.defer();

    db.query('SELECT * FROM heuremois WHERE mois =? AND annee =?  ', [month, year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

function getAllHeuresem(month, year) {
    var deferred = Q.defer();
    console.log(month, year);
    db.query('SELECT * FROM heuresemaine WHERE mois =? AND annee =?  ', [month, year], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}

/***************************************Planning équippe******************************************************************************/

function getAllEquipeouvrier() {
    var deferred = Q.defer();
    db.query('SELECT nom, prenom, equipe, chef_equipe,contact.id_contact, ouvrier_equipe.id_equipe FROM contact,ouvrier_equipe WHERE type = "ouvrier" AND ouvrier_equipe.id_contact = contact.id_contact ORDER BY equipe', function (error, equipe, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(equipe);
        deferred.resolve(equipe);
    });
    return deferred.promise;
}

function upouvrier(eParam) {

    var deferred = Q.defer();
    var params = [
        eParam.equipe,
        eParam.id_contact

    ];

    var query = "UPDATE contact SET equipe=? WHERE id_contact = ?  ";
    console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }


        deferred.resolve();
    });

    var query = "UPDATE ouvrier_equipe SET id_equipe=? WHERE id_contact = ?  ";
    console.log(query, params);
    db.query(query, params, function (error, results, fields) {
        if (error) {
            console.log(error.message);
            deferred.reject('MySql ERROR trying to update user informations (3) | ' + error.message);
        }

        deferred.resolve();
    });

    return deferred.promise;
}


function getAllouvrier() {
    var deferred = Q.defer();
    db.query('SELECT nom,prenom,contact.id_contact FROM  contact  WHERE TYPE =  "ouvrier" GROUP BY contact.id_contact', function (error, equipe, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log(error.name + ': ' + error.message);
        }
        //console.log(equipe);
        deferred.resolve(equipe);
    });
    return deferred.promise;
}

function addWorker(Eparams) {
    var deferred = Q.defer();
    //console.log("test1");
    console.log(Eparams);

    db.query("INSERT INTO ouvrier_equipe (id_contact, id_equipe) VALUES (? , ? )", [Eparams.test.desigantion.id_contact, Eparams.test.id_equipe], function (error, results, fields) {
        if (error) {
            deferred.reject(error.name + ': ' + error.message);
            console.log("(2)" + error.name + ': ' + error.message);
        }
    });
    return deferred.promise;
}

function getAllNamechantier(month, year) {
    var deferred = Q.defer();
    console.log(month, year);
    db.query('SELECT travail.id_chantier, chantier.nom_chantier FROM  `travail` ' +
        'LEFT JOIN chantier ON chantier.id_chantier = travail.id_chantier ' +
        'WHERE YEAR( DATE ) =? AND MONTH( DATE ) =? GROUP BY travail.id_chantier  ', [year,month], function (error, chantier, fields) {
        if (error) {
            console.log(error.name + ': ' + error.message);
            deferred.reject(error.name + ': ' + error.message);
        }
        deferred.resolve(chantier);
    });
    return deferred.promise;
}