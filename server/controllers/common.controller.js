var express = require('express');
var router = express.Router();
var commonService = require('services/common.service');

// routes pour les contacts
router.get('/caces/', getCACES);
router.post('/adresses/new', createAdresse);

module.exports = router;

function getCACES(req, res) {
    commonService.getCACES()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createAdresse(req, res) {
    commonService.createAdresse(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
