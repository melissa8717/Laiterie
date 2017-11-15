var express = require('express');
var router = express.Router();

var achatsService = require('services/achats.service');

var multer = require('multer');
var fs = require('fs');

// routes
router.post('/new', create);
router.post('/mat', addMat);
router.get('/', getAll);
router.get('/achat/all', getAllProduitsAchat);

router.put('/suivivehicule/:id_vehmat', updatevehmat);
router.get('/suivivehicule/:id_vehmat', getByIdmat);
router.get('/suivimateriel/:id_vehmat', getByIdvehmat);
router.get('/vehi', getAllVehimat);
router.get('/stock', getAllStock);
router.put('/stock/:id_produit/:stock', getStockclick);
router.delete('/vehimat/:id_vehmat', deletemat);
router.get('/suivimateriel/entretien/:id_vehmat', getByIdEntretien);
router.get('/suivivehicule/entre/:id_vehmat', getByIdEntretien1);
router.post('/entretien/:id_vehmat', addEntretien);
router.delete('/entre/:id_entretien', deleteEntre);


router.put('/:_id', update);
router.delete('/:_id', _delete);

router.get('/reference/:ref', getAllRef);
router.get('/tvas/alltvas', getAllTva);
router.get('/histo/:_id', getAllHisto);
router.get('/fournisseurs/all', getAllFournisseur);
router.get('/cat/all', getAllCategories);
router.get('/unite', getAllUnite);

router.get('/mainoeuvre/all', getAllMainOeuvre);
router.post('/mainoeuvre/new', createMainOeuvre);
router.put('/mainoeuvre/:_id', updateMainOeuvre);

router.post('/modifs', updateModif);

router.get('/composes/prdc', getAllProdComp);

router.get('/:_id/:num_version', getById);


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
            fs.mkdirSync('./files/produits/' + req.params._id);
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        try {
            fs.mkdirSync('./files/produits/' + req.params._id + '/image');
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        callback(null, './files/produits/' + req.params._id + '/image');

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
            fs.mkdirSync('./files/produits/' + req.params._id);
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        try {
            fs.mkdirSync('./files/produits/' + req.params._id + '/ged');
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        callback(null, './files/produits/' + req.params._id + '/ged');
    },
    filename: function (req, file, callback) {
        console.log(file.originalname);
        callback(null, file.originalname);
    }
});
var uploadGED = multer({storage: storageGED}).fields([{name: 'file'}]);

function downloadImage(req, res) {
    res.download("./files/produits/" + req.params._id + "/image/" + req.params.url);
}

function downloadGED(req, res) {
    res.download("./files/produits/" + req.params._id + "/ged" + req.params.url);
    C
}


/*************************************************************************************************************/

function create(req, res) {
    achatsService.create(req.body)
        .then(function (results) {
            //console.log(results.insertId);
            res.send("" + results.insertId);
        })
        .catch(function (err) {
            //console.log(err);
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    achatsService.getAll()
        .then(function (achats) {
            res.send(achats);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// get only produits achat
function getAllProduitsAchat(req, res) {
    achatsService.getAllProduitsAchat()
        .then(function (achats) {
            res.send(achats);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllMainOeuvre(req, res) {
    achatsService.getAllMainOeuvre()
        .then(function (mos) {
            res.send(mos);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createMainOeuvre(req, res) {
    achatsService.createMainOeuvre(req.body)
        .then(function (results) {
            //console.log(results.insertId);
            res.send("" + results.insertId);
            //res.sendStatus(200);
        })
        .catch(function (err) {
            //console.log(err);
            res.status(400).send(err);
        });
}

function updateMainOeuvre(req, res) {
    achatsService.updateMainOeuvre(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    achatsService.getById(req.params._id, req.params.num_version)
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
    achatsService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    achatsService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTva(req, res) {
    achatsService.getAllTva()
        .then(function (tvas) {
            res.send(tvas);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllCategories(req, res) {
    achatsService.getAllCategories()
        .then(function (categories) {
            res.send(categories);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllUnite(req, res) {
    achatsService.getAllUnite()
        .then(function (unites) {
            res.send(unites);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFournisseur(req, res) {
    achatsService.getAllFournisseur()
        .then(function (fourniss) {
            res.send(fourniss);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllProdComp(req, res) {
    achatsService.getAllProdComp()
        .then(function (prod_comp) {
            res.send(prod_comp);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllHisto(req, res) {
    achatsService.getAllHisto(req.params._id)
        .then(function (modifs) {
            res.send(modifs);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateModif(req, res) {
    achatsService.updateModif(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send(err);
        });
}

function getAllStock(req, res) {
    achatsService.getAllStock()
        .then(function (produit) {
            res.send(produit);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getStockclick(req, res) {
    achatsService.getStockclick(req.params.id_produit, req.params.stock)
        .then(function () {

            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function addMat(req, res) {
    //console.log("test");
    achatsService.addMat(req.body)
        .then(function (Vehiculemateriel) {
            res.send(Vehiculemateriel);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllVehimat(req, res) {
    //console.log("test");
    achatsService.getAllVehimat()
        .then(function (Vehiculemateriel) {
            res.send(Vehiculemateriel);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updatevehmat(req, res) {
    achatsService.updatevehmat(req.params.id_vehmat, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getByIdvehmat(req, res) {
    achatsService.getByIdvehmat(req.params.id_vehmat, req.body)
        .then(function (Vehiculemateriel) {
            if (Vehiculemateriel) {
                res.send(Vehiculemateriel);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdmat(req, res) {
    achatsService.getByIdmat(req.params.id_vehmat)
        .then(function (Vehiculemateriel) {
            if (Vehiculemateriel) {
                res.send(Vehiculemateriel);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletemat(req, res) {
    //console.log('test1');
    achatsService.deletemat(req.params.id_vehmat)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdEntretien(req, res) {
    achatsService.getByIdEntretien(req.params.id_vehmat)
        .then(function (entretien) {
            if (entretien) {
                res.send(entretien);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdEntretien1(req, res) {
    achatsService.getByIdEntretien1(req.params.id_vehmat)
        .then(function (entretien) {
            if (entretien) {
                res.send(entretien);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllRef(req, res) {
    //console.log("test");
    achatsService.getAllRef(req.params.ref)
        .then(function (produit) {
            res.send(produit);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addEntretien(req, res) {
    //console.log("test3");
    achatsService.addEntretien(req.body, req.params.id_vehmat)
        .then(function (entretien) {
            res.send(entretien);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}

function deleteEntre(req, res) {
    //console.log('test1');
    achatsService.deleteEntre(req.params.id_entretien)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
