var express = require('express');
var router = express.Router();

var ganttService = require('../services/gantt.service');

// TASKS
router.get('/:id_chantier', getTasksByIdChantier);
router.post('/', createTask);
router.delete('/:id', removeTask);
router.put('/:id', updateTask);

// LINKS
router.get('/liens/:id_tache', getLinksByIdTache);
router.post('/liens', createLink);
router.delete('/liens/:id', removeLink);
router.put('/liens/:id', updateLink);

module.exports = router;

function createTask(req, res) {
    ganttService.createTask(req.body)
        .then(function (results) {
            res.status(200).send("" + results.insertId);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createLink(req, res) {
    ganttService.createLink(req.body)
        .then(function (results) {
            res.status(200).send("" + results.insertId);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTask(req, res) {
    ganttService.updateTask(req.body)
        .then(function (results) {
            res.status(200).send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateLink(req, res) {
    console.log("updateLink");
    ganttService.updateLink(req.body)
        .then(function (results) {
            res.status(200).send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function removeTask(req, res) {
    ganttService.removeTask(req.params.id)
        .then(function (results) {
            res.status(200).send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function removeLink(req, res) {
    ganttService.removeLink(req.params.id)
        .then(function (results) {
            res.status(200).send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getTasksByIdChantier(req, res) {
    ganttService.getTasksByIdChantier(req.params.id_chantier)
        .then(function (results) {
            res.status(200).send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getLinksByIdTache(req, res) {
    ganttService.getLinksByIdTache(req.params.id_tache)
        .then(function (results) {
            res.status(200).send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}