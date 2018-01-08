var express = require('express');
var router = express.Router();
var chantierService = require('services/chantier.service');

var multer = require('multer');
var fs = require('fs');

// routes
router.post('/add', add);
router.get('/', getAllChantier);
router.get('/', getAll);


router.get('/chantier', getAll);

/*-----------------nom chantier-----------------------*/

router.get('/nom/:id_chantier', getByIdNom);

/*--------------------------------------fiche chantier--------------------------------*/
router.get('/fichechantier/:id_chantier', getByIdTout);
router.put('/up', updateFiche);
router.get('/phase/:id_chantier', getByIdPhase);
router.delete('/dphase/:id_phase', deletePhase);
router.post('/adphase/:id_chantier', addPhase);
router.get('/rapport/:id_chantier', getByIdRapport);
router.post('/adrap/:id_chantier', addRapport);
router.delete('/drapport/:id_rapport', deleteRapport);


router.get('/ajout/:id_devis/:num_version', getByIdCdevis);
router.post('/new', createChantier);

router.get('/devisproduit/:id_chantier', getByIdDevis);
router.get('/devisoption/:id_chantier', getByIdDevisoption);

/*----------------previsionnelle--------------------------*/
router.get('/prevision/:id_chantier', getByIdPrev);
router.get('/prevopt/:id_chantier', getByIdPrevopt);

/*------------chantier du mois--------------------------------*/
router.get('/mois/:month/:year', getAllMois);
router.get('/cmois', getAllCmois);

/*-----------------------devis chantier ----------------------------------------*/
router.get('/devischantier/:id_chantier', getByIdDevischantier);
router.put('/chantierdevis', updateDevischantier);

/*----------analyse temps---------------------*/
router.get('/analyse/:id_chantier', getByIdAnalyse);
router.get('/optanalyse/:id_chantier', getByIdAnalyseoption);

/*-----------Reel--------------------*/
router.get('/reel/:id_chantier', getByIdReel);
router.get('/getByIdReelibre/:id_chantier',getByIdReelibre);

router.put('/:_id', update);
router.delete('/:_id', _delete);
router.put('/chantier/:id_chantier', update);

router.get('/:_id', getById);

/*-------------------------------balance chantier-------------------------------*/

router.get('/accompte/:id_chantier', getByIdAcco);
router.get('/totaldevis/:id_chantier', getByIdTotalDevis);
router.get('/factures/:id_chantier', getByIdFacturechantier);
router.get('/libre/:id_chantier', getByIdDevislibre);
router.get('/prevois/:id_chantier', getByIdfraispre);
router.get('/reelgeneraux/:id_chantier', getByIdfraisreel);
router.get('/pourcentdevis/:id_chantier', getByIdpourcentdevis);
router.get('/mainreel/:id_chantier', getByIdmainreel);
router.get('/balance/:id_chantier', getByIdBalance);

/******************GED***********************************/
router.get('/:_id/image/download', downloadImage);
router.get('/:_id/ged/download', downloadGED);

router.post('/:_id/image/upload', function (req, res) {
    console.log(req.body);
    uploadImage(req, res, function (err) {
        if (err) {
            console.log("Error uploading file.");
            console.log(err);
            return res.end(JSON.stringify(err));
        }
        console.log("Image is uploaded");
        res.end("Image uploaded");
    });
});
router.post('/:_id/ged/upload', function (req, res) {
    console.log("In Router ged");
    uploadGED(req, res, function (err) {
        if (err) {
            console.log("Error uploading file.");
            return res.end(JSON.stringify(err));
        }
        console.log("GED is uploaded");
        res.end("GED is uploaded");
    });
});

module.exports = router;

var storageImage = multer.diskStorage({
    destination: function (req, file, callback) {
        try {
            fs.mkdirSync('./files/chantiers/' + req.params._id);
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        try {
            fs.mkdirSync('./files/chantiers/' + req.params._id + '/image');
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        callback(null, './files/chantiers/' + req.params._id + '/image');

    },
    filename: function (req, file, callback) {
        console.log(file.originalname);
        callback(null, file.originalname);
    }
});
var uploadImage = multer({storage: storageImage}).fields([{name: 'file'}]);

var storageGED = multer.diskStorage({
    destination: function (req, file, callback) {
        try {
            fs.mkdirSync('./files/chantiers/' + req.params._id);
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        try {
            fs.mkdirSync('./files/chantiers/' + req.params._id + '/ged');
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        callback(null, './files/chantiers/' + req.params._id + '/ged');
    },
    filename: function (req, file, callback) {
        console.log(file.originalname);
        callback(null, file.originalname);
    }
});
var uploadGED = multer({storage: storageGED}).fields([{name: 'file'}]);

function downloadImage(req, res) {
    res.download("./files/chantiers/" + req.params._id + "/image/" + req.params.url);
}

function downloadGED(req, res) {
    res.download("./files/chantiers/" + req.params._id + "/ged" + req.params.url);
    C
}


/*************************************************************************************************************/
function getAll(req, res) {
    chantierService.getAll()
        .then(function (chantiers) {
            res.send(chantiers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    chantierService.getById(req.params._id)
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

function getByIdChantier(req, res) {
    chantierService.getByIdChantier(req.params.id_chantier, req.body)
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


function add(req, res) {
    chantierService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllChantier(req, res) {
    //console.log("test");
    chantierService.getAllChantier()
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function update(req, res) {
    chantierService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function _delete(req, res) {
    chantierService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


/*----------------------nom chantier---------------------------------------*/

function getByIdNom(req, res) {
    chantierService.getByIdNom(req.params.id_chantier)
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


/*------------------------------fiche chantier---------------------------------*/

function updateFiche(req, res) {
    chantierService.updateFiche(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdTout(req, res) {
    chantierService.getByIdTout(req.params.id_chantier)
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

function getByIdPhase(req, res) {
    chantierService.getByIdPhase(req.params.id_chantier)
        .then(function (phase) {
            if (phase) {
                res.send(phase);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletePhase(req, res) {
    //console.log('test1');
    chantierService.deletePhase(req.params.id_phase)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addPhase(req, res) {
    chantierService.addPhase(req.body, req.params.id_chantier)
        .then(function (phase) {
            res.send(phase);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}

function getByIdRapport(req, res) {
    chantierService.getByIdRapport(req.params.id_chantier)
        .then(function (phase) {
            if (phase) {
                res.send(phase);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addRapport(req, res) {
    chantierService.addRapport(req.body, req.params.id_chantier)
        .then(function (phase) {
            res.send(phase);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}

function deleteRapport(req, res) {
    //console.log('test1');
    chantierService.deleteRapport(req.params.id_rapport)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*------------------------------------ajout chantier---------------------------------*/


function getByIdCdevis(req, res) {
    chantierService.getByIdCdevis(req.params.id_devis, req.params.num_version, req.body)
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

function createChantier(req, res) {
    chantierService.createChantier(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*------------------------------------produit devis du chantier------------------------------------------*/

function getByIdDevis(req, res) {
    chantierService.getByIdDevis(req.params.id_chantier, req.body)
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

function getByIdDevisoption(req, res) {
    chantierService.getByIdDevisoption(req.params.id_chantier, req.body)
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

/*----------------liste chantier mois ----------------------------------------*/

function getAllMois(req, res) {
    //console.log("test");
    chantierService.getAllMois(req.params.month, req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllCmois(req, res) {
    chantierService.getAllCmois()
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*------------------------------------liste devis chantire-------------------------------------*/

function getByIdDevischantier(req, res) {
    chantierService.getByIdDevischantier(req.params.id_chantier)
        .then(function (results) {
            if (results) {
                res.send(results);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateDevischantier(req, res) {
    //console.log("test3");
    chantierService.updateDevischantier(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


/*----------------------previsionnelle--------------------------------------*/

function getByIdPrev(req, res) {
    //console.log('test2')
    chantierService.getByIdPrev(req.params.id_chantier, req.body)
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

function getByIdPrevopt(req, res) {
    //console.log('test2')
    chantierService.getByIdPrevopt(req.params.id_chantier, req.body)
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

/*------------------------------------------analyse etmps -------------------------------------------------------*/

function getByIdAnalyse(req, res) {
    chantierService.getByIdAnalyse(req.params.id_chantier, req.body)
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

function getByIdAnalyseoption(req, res) {
    chantierService.getByIdAnalyseoption(req.params.id_chantier, req.body)
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

/*-------------------------reel--------------------------------*/

function getByIdReel(req, res) {
    chantierService.getByIdReel(req.params.id_chantier, req.body)
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

function getByIdReelibre(req, res) {
    chantierService.getByIdReelibre(req.params.id_chantier, req.body)
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

/*--------------------balance chantier-----------------------------------*/

function getByIdAcco(req, res) {
    chantierService.getByIdAcco(req.params.id_chantier, req.body)
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

function getByIdTotalDevis(req, res) {
    chantierService.getByIdTotalDevis(req.params.id_chantier, req.body)
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

function getByIdFacturechantier(req, res) {
    //console.log('test12');
    chantierService.getByIdFacturechantier(req.params.id_chantier, req.body)
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

function getByIdDevislibre(req, res) {
    chantierService.getByIdDevislibre(req.params.id_chantier, req.body)
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


function getByIdfraispre(req, res) {
    chantierService.getByIdfraispre(req.params.id_chantier, req.body)
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

function getByIdfraisreel(req, res) {
    chantierService.getByIdfraisreel(req.params.id_chantier, req.body)
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

function getByIdBalance(req, res) {
    chantierService.getByIdBalance(req.params.id_chantier, req.body)
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

function getByIdpourcentdevis(req, res) {
    chantierService.getByIdpourcentdevis(req.params.id_chantier, req.body)
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

function getByIdmainreel(req, res) {
    chantierService.getByIdmainreel(req.params.id_chantier, req.body)
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

