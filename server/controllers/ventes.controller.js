var express = require('express');
var router = express.Router();
var ventesService = require('services/ventes.service');

// routes
router.post('/new', create);
router.post('/newVersion', createVersion);
router.post('/newprodcomp', addInProdComposes);

router.get('/', getAll);
router.get('/id/:_id/:num_version', getById);
router.get('/id/:_id', getAllHisto);
router.get('/composes/:_id/:num_version', getAllProdComp);

router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function create(req, res) {
    ventesService.create(req.body)
        .then(function (results) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createVersion(req, res) {
    ventesService.createVersion(req.body)
        .then(function (results) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addInProdComposes(req, res) {
    ventesService.addInProdComposes(req.body)
        .then(function (results) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    ventesService.getAll()
        .then(function (ventes) {
            res.send(ventes);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// recupere les produits composes d'un produit vente
function getAllProdComp(req, res) {
    ventesService.getAllProdComp(req.params._id, req.params.num_version)
        .then(function (prodComps) {
            if (prodComps) {
                res.send(prodComps);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllHisto(req, res) {
    ventesService.getAllHisto(req.params._id)
        .then(function (produit) {
            if (produit) {
                res.send(produit);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    ventesService.getById(req.params._id, req.params.num_version)
        .then(function (produit) {
            if (produit) {
                res.send(produit);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    ventesService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    ventesService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}