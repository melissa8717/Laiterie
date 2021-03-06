var express = require('express');
var router = express.Router();
var paramsService = require('services/params.service');


router.get('/footer', getFooter);
router.post('/dagen', addagence);
router.get('/agence', getAllAgence);
router.get('/filig', getAllFili);

router.put('/modifyagence', updateAgence);

router.get('/tva', getAllTVA);
router.put('/modtva', updateTva);

router.get('/cat', getAllCat);
router.put('/up', updateCat);
router.post('/addcat', addCat);
router.get('/unite', getAllUnite);
router.put('/upunite', updateUnite);
router.post('/addunite', addUnite);

router.get('/condition', getAllVente);
router.put('/addcondition', updateVente);
router.post('/addVente',addVente);

router.post('/addfrais', addfraisprev);
router.get('/frais', getAllFrais);

router.post('/addLicence', addLicence);

router.get('/home', getAllHome);

router.get('/util/:id', getByIduser);
router.get('/droit/:id', getByIdDroit);

router.delete('/supp/:id', deleteuser);
router.put('/upuser', updateuser);

router.put('/test',updateTest);
router.get('/compte',getCompte);
router.get('/comlic',getComlic);

router.post('/formation', addFormation);
router.get('/retfor', getAllFormation);

router.get('/alarmform', getAlarmeformation);
router.get('/alarcaces', getAlarmecaces);
router.get('/visitemedicale',getVisitemedicale);


module.exports = router;


function getFooter(req, res) {
    paramsService.getFooter()
        .then(function (footer) {
            res.send(footer);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*------------------agence----------------------------------------*/
function addagence(req, res) {
    paramsService.addagence(req.body)
        .then(function (result) {
            res.status(200).send("" + result.insertId);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllAgence(req, res) {
    paramsService.getAllAgence()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFili(req, res) {
    paramsService.getAllFili()
        .then(function (filigrane) {
            res.send(filigrane);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateAgence(req, res) {
    paramsService.updateAgence(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*----------------------------------TVA----------------------------------------*/

function getAllTVA(req, res) {
    paramsService.getAllTVA()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTva(req, res) {
    paramsService.updateTva(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*-------------------Catégories produits------------------------------*/

function getAllCat(req, res) {
    paramsService.getAllCat()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateCat(req, res) {
    paramsService.updateCat(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addCat(req, res) {
    paramsService.addCat(req.body)
        .then(function (agen) {
            res.send(agen);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllUnite(req, res) {
    paramsService.getAllUnite()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUnite(req, res) {
    paramsService.updateUnite(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addUnite(req, res) {
    paramsService.addUnite(req.body)
        .then(function (agen) {
            res.send(agen);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*-----------------condition générale vente --------------------------------*/
function getAllVente(req, res) {
    paramsService.getAllVente()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateVente(req, res) {
    paramsService.updateVente(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addVente(req, res) {
    paramsService.addVente(req.body)
        .then(function (agen) {
            res.send(agen);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addfraisprev(req, res) {
    paramsService.addfraisprev(req.body)
        .then(function (agen) {
            res.send(agen);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFrais(req, res) {
    paramsService.getAllFrais()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addLicence(req, res) {
    paramsService.addLicence(req.body)
        .then(function (licence) {
            res.send(licence);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}

function getAllHome(req, res) {
    paramsService.getAllHome()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIduser(req, res) {
    paramsService.getByIduser(req.params.id)
        .then(function (chantier) {
            if (chantier) {
                res.send(chantier);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdDroit(req, res) {
    paramsService.getByIdDroit(req.params.id)
        .then(function (msg) {
            res.send(msg);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteuser(req, res) {
    paramsService.deleteuser(req.params.id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateuser(req, res) {
    paramsService.updateuser(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTest(req, res) {
    paramsService.updateTest(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCompte(req, res) {
    paramsService.getCompte()
        .then(function (nbUsers) {
            res.send(nbUsers.toString());
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getComlic(req, res) {
    paramsService.getComlic()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addFormation(req, res) {
    paramsService.addFormation(req.body)
        .then(function (agen) {
            res.send(agen);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFormation(req, res) {
    paramsService.getAllFormation()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAlarmecaces(req, res) {
    paramsService.getAlarmecaces()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAlarmeformation(req, res) {
    paramsService.getAlarmeformation()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getVisitemedicale(req, res) {
    paramsService.getVisitemedicale()
        .then(function (agence) {
            res.send(agence);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}