/**
 * Created by Alexandre on 08/06/2017.
 */
var express = require('express');
var router = express.Router();
var commandeService = require('services/commandes.service');

// routes
router.post('/add', add);
router.get('/listing', getAllListing);
router.get('/details/:id_demande', getByIdDetail);
router.get('/products/:_id', getAllProducts);
router.get('/', getAllDate);
router.get('/imprevu/:_id', getAllImprevuProducts);
router.get('/:month/:year', getAll);
router.get('/:_id', getById);
router.put('/state/:_id', changeState);
router.put('/validate/:_id', validate);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.post('/demande', demandes);

module.exports = router;


function getAllDate(req, res) {
    commandeService.getAllDate()
        .then(function (chantiers) {
            res.send(chantiers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    commandeService.getAll(req.params.month, req.params.year)
        .then(function (chantiers) {
            res.send(chantiers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function changeState(req, res) {

    commandeService.changeState(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function validate(req, res) {
    commandeService.validate(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllImprevuProducts(req, res) {
    commandeService.getAllImprevuProducts(req.params._id)
        .then(function (products) {
            res.send(products);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllProducts(req, res) {
    commandeService.getAllProducts(req.params._id)
        .then(function (products) {
            res.send(products);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function add(req, res) {
    commandeService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getById(req, res) {
    //console.log("test");
    commandeService.getById(req.params._id)
        .then(function (bdc) {
            //console.log(bdc);
            if (bdc) {
                res.send(bdc);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    commandeService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    commandeService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function demandes(req, res) {
    commandeService.demandes(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllListing(req, res) {
    commandeService.getAllListing()
        .then(function (produit) {
            res.send(produit);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdDetail(req, res) {
    console.log("test");
    commandeService.getByIdDetail(req.params.id_demande)
        .then(function (bdc) {
            if (bdc) {
                res.send(bdc);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}