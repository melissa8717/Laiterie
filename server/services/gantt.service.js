var Q = require('q');
var db = require('../db.js').get();

var service = {};

// TASKS
service.getTasksByIdChantier = getTasksByIdChantier;
service.createTask = createTask;
service.updateTask = updateTask;
service.removeTask = removeTask;

// LINKS
service.getLinksByIdTache = getLinksByIdTache;
service.createLink = createLink;
service.updateLink = updateLink;
service.removeLink = removeLink;

module.exports = service;

function getTasksByIdChantier(id_chantier) {
    var deferred = Q.defer();

    db.query('SELECT * FROM gantt WHERE id_chantier = ?', [id_chantier],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function getLinksByIdTache(id_tache) {
    var deferred = Q.defer();

    db.query('SELECT DISTINCT * FROM gantt_lien WHERE source = ? OR target = ?', [id_tache, id_tache],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function createTask(task) {
    var deferred = Q.defer();

    db.query('INSERT INTO gantt (start_date, text, progress, duration, parent, id_chantier) VALUES (?,?,?,?,?,?)',
        [task.start_date, task.text, task.progress, task.duration, task.parent, task.id_chantier],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function createLink(link) {
    var deferred = Q.defer();

    db.query('INSERT INTO gantt_lien (source, target, type) VALUES (?,?,?)',
        [link.source, link.target, link.type],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function removeTask(id) {
    var deferred = Q.defer();

    db.query('DELETE FROM gantt WHERE id = ?', [id],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function removeLink(id) {
    var deferred = Q.defer();

    db.query('DELETE FROM gantt_lien WHERE id = ?', [id],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function updateTask(task) {
    var deferred = Q.defer();

    db.query('UPDATE gantt SET start_date = ?, text = ?, progress = ?, duration = ?, parent = ? WHERE id = ?',
        [task.start_date, task.text, task.progress, task.duration, task.parent, task.id],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function updateLink(link) {
    console.log("updateLink");
    var deferred = Q.defer();

    db.query('UPDATE gantt_lien SET source = ?, target = ?, type = ? WHERE id = ?',
        [link.source, link.target, link.type, link.id],
        function (error, results) {
            if (error) {
                deferred.reject(error.name + ': ' + error.message);
                console.log(error.name + ': ' + error.message);
            }
            console.log(results);
            deferred.resolve(results);
        });

    return deferred.promise;
}