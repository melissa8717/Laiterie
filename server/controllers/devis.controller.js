/**
 * Created by Wbat on 04/07/2017.
 */
/**
 * Created by Alexandre on 08/06/2017.
 */
var config = require('config.json');
var express = require('express');
var router = express.Router();
var devisService = require('services/devis.service');
var multer = require('multer');
var fs = require('fs');

router.put('/detail',updateDevisdetail);
router.put('/opdet',updateDevisoption);

// routes
router.post('/addLibre', addLibre);

router.post('/add', add);
router.post('/duplicate/:_id', duplicate);
router.put('/offer', offerlibre);
router.put('/acceptoffer', acceptoffer);
router.put('/modify/:_id/:num_version', modify);
router.put('/modifylibre/:id_devis/:num_version', modifylibre); /////////////////////////////////////////////////////////////
router.get('/:month/:year', getAll);
router.get('/', getAllDate);
router.get('/products/:_id', getAllProducts);
router.get('/id/:_id/:num_version', getById);
router.put('/validate', validate);
router.put('/envoye/:id/:num_version', envoye);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/log/', getLogo);


/*----------------------------devis libre-------------------------------------------*/
router.get('/tva',getAllTVA);

/*----------------Analyse Devis----------------------------*/
router.get('/analyse/:id_devis/:num_version',getByIdAnalyse);
router.get('/option/:id_devis/:num_version',getByIdAnalyseopt);
router.get('/anldevis/:id_devis/:num_version',getByIdAnaldevis);
router.get('/fichedevis/:id_devis/:num_version',getByIdLibre);
router.get('/ffdevis/:id_devis/:num_version',getByIdLibreproduit);

router.get('/duplibre/:id_devis/:num_version',getByIddupliquer);
router.post('/libreduplicate/:id_devis',duplicatelibre);



module.exports = router;

function validate(req, res) {
    devisService.validate(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function acceptoffer(req, res) {
    devisService.acceptoffer(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function modify(req, res) {
    devisService.modify(req.body, req.params._id, req.params.num_version)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function modifylibre(req, res) {
    devisService.modifylibre(req.body, req.params.id_devis, req.params.num_version)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function envoye(req, res) {
    devisService.envoye(req.params.id, req.params.num_version)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function duplicate(req, res) {
    devisService.duplicate(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllProducts(req, res) {
    devisService.getAllProducts(req.params._id)
        .then(function (products) {
            res.send(products);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addLibre(req, res) {
    devisService.createLibre(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function add(req, res) {
    devisService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllDate(req, res) {
    devisService.getAllDate()
        .then(function (chantiers) {
            res.send(chantiers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    devisService.getAll(req.params.month, req.params.year)
        .then(function (chantiers) {
            res.send(chantiers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    devisService.getById(req.params._id, req.params.num_version)
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

function update(req, res) {
    devisService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    devisService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*-------------------devis libre---------------------------------*/

function getAllTVA(req, res) {
    devisService.getAllTVA()
        .then(function (chantiers) {
            res.send(chantiers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/************************Analyse devis***********************************************/

function getByIdAnalyse(req, res) {
    //console.log('test12');
    devisService.getByIdAnalyse(req.params.id_devis,req.params.num_version, req.body)
        .then(function (test) {
            if (test) {
                res.send(test);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getLogo(req, res) {
    devisService.getLogo(req.params._id)
        .then(function (log) {
            res.send(log);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getByIdAnalyseopt(req, res) {
    //console.log('test12');
    devisService.getByIdAnalyseopt(req.params.id_devis,req.params.num_version, req.body)
        .then(function (test) {
            if (test) {
                res.send(test);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateDevisdetail(req, res) {
    //console.log("test3");
    devisService.updateDevisdetail(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateDevisoption(req, res) {
    //console.log("test3");
    devisService.updateDevisoption(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getByIdAnaldevis(req, res) {
    devisService.getByIdAnaldevis(req.params.id_devis,req.params.num_version, req.body)
        .then(function (test) {
            if (test) {
                res.send(test);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibre(req, res) {
    devisService.getByIdLibre(req.params.id_devis,req.params.num_version, req.body)
        .then(function (test) {
            if (test) {
                res.send(test);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibreproduit(req, res) {
    devisService.getByIdLibreproduit(req.params.id_devis,req.params.num_version, req.body)
        .then(function (test) {
            if (test) {
                res.send(test);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function offerlibre(req, res) {
    console.log('test12');
    devisService.offerlibre(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIddupliquer(req, res) {
    devisService.getByIddupliquer(req.params.id_devis, req.params.num_version)
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

function duplicatelibre(req, res) {
    devisService.duplicatelibre(req.params.id_devis, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}