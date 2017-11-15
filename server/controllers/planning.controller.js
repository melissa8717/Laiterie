/**
 * Created by Wbat on 07/08/2017.
 */
var express = require('express');
var router = express.Router();

var planningService = require('services/planning.service');

// routes pour les contacts
router.post('/new', create);
router.post('/addEmployeEvents', addEmployeEvents);
router.post('/addTeamEvents', addTeamEvents);
router.get('/', getAll);
router.get('/travail', getAllTravail);
router.get('/alarms/:id', getAlarms);
router.put('/ouvrier', upouvrier);
router.put('/:id', update);
router.put('/validate/:id', validate);
router.put('/validateTeam/:id', validateTeam);
router.delete('/:id', _delete);
router.delete('/travail/:id', _deleteTravail);
router.delete('/travailEquipe/:id', _deleteTravailEquipe);
router.put('/:id_planning', updateplanning_simple);
router.post('/addEquipe', addEquipe);
router.delete('/:id_equipe', deleteEquipe);
router.get('/equipe', getAllEquipe);
router.get('/recap/:month/:year', getAllRecap);

router.get('/semaine/:month/:year', getAllHeuresem);

router.get('/worker', getAllEquipeouvrier);
router.get('/allouvrier', getAllouvrier);
router.post('/adoubvrir', addWorker);


module.exports = router;


function addEmployeEvents(req, res) {
    planningService.addEmployeEvents(req.body)
        .then(function (data) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addTeamEvents(req, res) {
    planningService.addTeamEvents(req.body)
        .then(function (data) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    planningService.getAll()
        .then(function (rdv) {
            res.send(rdv);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAlarms(req, res) {
    planningService.getAlarms()
        .then(function (rdv) {
            res.send(rdv);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTravail(req, res) {
    planningService.getAllTravail()
        .then(function (rdv) {
            res.send(rdv);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    planningService._delete(req.params.id)
        .then(function (data) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _deleteTravail(req, res) {
    planningService._deleteTravail(req.params.id)
        .then(function (data) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _deleteTravailEquipe(req, res) {
    planningService._deleteTravailEquipe(req.params.id)
        .then(function (data) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    planningService.update(req.params.id, req.body)
        .then(function (data) {
            console.log("ok");
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log("err");

            res.status(400).send(err);
        });
}


function validate(req, res) {
    planningService.validate(req.params.id, req.body)
        .then(function (data) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function validateTeam(req, res) {
    planningService.validateTeam(req.params.id, req.body)
        .then(function (data) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    planningService.create(req.body)
        .then(function (data) {
            console.log("" + data);
            res.send("" + data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateplanning_simple(req, res) {
    planningService.update(req.params.id, req.body)
        .then(function (data) {
            console.log("ok");
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log("err");

            res.status(400).send(err);
        });
}


function addEquipe(req, res) {
    //console.log("test3");
    planningService.addEquipe(req.body, req.params.id_equipe)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}


function deleteEquipe(req, res) {

    achatsService.deleteEquipe(req.params.id_equipe)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllEquipe(req, res) {
    planningService.getAllEquipe()
        .then(function (Equipe) {
            res.send(Equipe);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllRecap(req, res) {
    //console.log("test");
    planningService.getAllRecap(req.params.month, req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getAllHeuresem(req, res) {
    //console.log("test");
    planningService.getAllHeuresem(req.params.month, req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllEquipeouvrier(req, res) {
    planningService.getAllEquipeouvrier()
        .then(function (Equipe) {
            res.send(Equipe);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function upouvrier(req, res) {
    //console.log("test3");
    planningService.upouvrier(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getAllouvrier(req, res) {
    planningService.getAllouvrier()
        .then(function (Equipe) {
            res.send(Equipe);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addWorker(req, res) {
    //console.log("test3");
    planningService.addWorker(req.body)
        .then(function () {
            res.send(200);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}