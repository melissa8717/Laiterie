var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var commonService = require('services/common.service');
var contactService = require('services/contact.service');
var pdfService = require('services/pdf.service');

// routes pour les contacts
router.post('/new', create);
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
router.get('/', getAll);
router.get('/listcaces', getAllCaces);
router.get('/test', getAllform);
router.get('/fournisseurs', getAllFournisseurs);
router.get('/equipes', getAllEquipes);
router.get('/ouvriers', getAllOuvriers);
router.get('/employe', getAllEmploye);
router.get('/address/:_id', getAddress);
router.get('/clients', getAllClients);
router.get('/liste', getList);
router.get('/allinfos/:_id', getByIdAllInfos);
router.get('/fiche/:_id/download', downloadFiche);
router.get('/qualifications', getQualifications);
router.get('/:_id/image/download', downloadImage);
router.get('/:_id/ged/download', downloadGED);
router.get('/:_id', getById);
router.put('/upcaces', upCaces);
router.put('/modiform', upFormation);
router.put('/:_id', update);
router.delete('/fiche/:_id/delete', deleteFiche);
router.delete('/:_id', _delete);

router.get('/chantier/:id_contact', getByIdchantier);
router.get('/encours/:id_contact', getByIdencours);

router.get('/contrat/:id_contact', getByIdContrat);
router.get('/lastcontrat/:id_contact', getByIdLastContrat);
router.post('/addcontrat/', addcontrat);
router.post('/newcontrat/:id_contact', newcontrat);

router.get('/devis/:id_contact', getByIdDevisclient);


router.post('/formation', addForm);
router.get('/nom/:id_contact', getByIdNom);
router.get('/idform/:id_contact', getByIdFormation);
router.post('/ajoutcaces', addCaces);
router.get('/selcaces/:id_contact', getByIdCaces);

router.post('/eequipements/:id_contact', equipement);
router.get('/allequipe/:id_contact', getByIdequipement);
router.delete('/entre/:id_equipement', deleteEquipement);


module.exports = router;

var storageImage = multer.diskStorage({
    destination: function (req, file, callback) {
        try {
            fs.mkdirSync('./files/contact/' + req.params._id);
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        try {
            fs.mkdirSync('./files/contact/' + req.params._id + '/image');
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        callback(null, './files/contact/' + req.params._id + '/image');

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
            fs.mkdirSync('./files/contact/' + req.params._id);
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        try {
            fs.mkdirSync('./files/contact/' + req.params._id + '/ged');
        }
        catch (err) {
            if (err.code != "EEXIST") throw err;
        }
        callback(null, './files/contact/' + req.params._id + '/ged');
    },
    filename: function (req, file, callback) {
        console.log(file.originalname);
        callback(null, file.originalname);
    }
});
var uploadGED = multer({storage: storageGED}).fields([{name: 'file'}]);

function downloadImage(req, res) {
    res.download("./files/contact/" + req.params._id + "/image/" + req.params.url);
}

function downloadGED(req, res) {
    res.download("./files/contact/" + req.params._id + "/ged" + req.params.url);
}

function getAllClients(req, res) {
    contactService.getAllClients()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFournisseurs(req, res) {
    contactService.getAllFournisseurs()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllEquipes(req, res) {
    contactService.getAllEquipes()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllOuvriers(req, res) {
    contactService.getAllOuvriers()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllEmploye(req, res) {
    contactService.getAllEmploye()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function create(req, res) {
    contactService.create(req.body.contact)
        .then(function (data) {
            creerInfosComplementaires(data.insertId);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

    function creerInfosComplementaires(insertId) {
        req.body.contact.id_contact = insertId;
        req.body.mail.id_contact = insertId;
        req.body.mailPro.id_contact = insertId;
        req.body.telephoneFixe.id_contact = insertId;
        req.body.telephoneMobile.id_contact = insertId;
        req.body.telephoneFax.id_contact = insertId;
        req.body.telephonePro.id_contact = insertId;
        req.body.adresse.id_contact = insertId;

        Promise.all([contactService.createMail(req.body.mail),
            contactService.createMail(req.body.mailPro),
            contactService.createTelephone(req.body.telephoneFixe),
            contactService.createTelephone(req.body.telephoneMobile),
            contactService.createTelephone(req.body.telephoneFax),
            contactService.createTelephone(req.body.telephonePro),
            commonService.createAdresse(req.body.adresse),
            contactService.linkContactQualification(insertId, req.body.qualification),
            contactService.createContrat(req.body.contact),
            pdfService.buildContact(req.body)])
            .then(function (results) {
                res.send("" + insertId);
            })
            .catch(function (err) {
                console.log("Fail creation infos complementaires");
                res.status(400).send(err);
            });
    }
}

function downloadFiche(req, res) {
    res.download("./files/fichecontact/fichecontact_" + req.params._id + ".pdf");
}

function getAll(req, res) {
    //console.log("test");
    contactService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getList(req, res) {
    contactService.getList()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    var contact = {};
    contactService.getById(req.params._id)
        .then(function (contact) {
            if (contact) {
                res.send(contact[0]);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdAllInfos(req, res) {
    contactService.getById(req.params._id)
        .then(function (contact) {
            if (contact) {
                getInfosComplementaires(contact[0]);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

    function getInfosComplementaires(contact) {
        var contactInfos = {};
        contactInfos.contact = contact;
        Promise.all([contactService.getMailsById(req.params._id),
            contactService.getTelephonesById(req.params._id),
            commonService.getAdresseByContact(req.params._id),
            contactService.getContratsById(req.params._id),
            contactService.getQualificationsById(req.params._id)])
            .then(function (results) {
                contactInfos.mails = results[0];
                contactInfos.telephones = results[1];
                contactInfos.adresse = (results[2].length > 0) ? results[2][0] : null;
                contactInfos.contrats = results[3];
                contactInfos.qualification = (results[4].length > 0) ? results[4][0].id_qualification : undefined;
                res.send(contactInfos);
            })
            .catch(function (err) {
                console.log("Fail getting infos complementaires");
                console.log(err);
            });
    }
}


function getAddress(req, res) {
    contactService.getAddress(req.params._id)
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getQualifications(req, res) {
    contactService.getQualifications()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function update(req, res) {
    var id = req.body.contact.id_contact;
    Promise.all([contactService.update(req.body.contact),
        contactService.updateMail(req.body.mail),
        contactService.updateMail(req.body.mailPro),
        contactService.updateTelephone(req.body.telephoneFixe),
        contactService.updateTelephone(req.body.telephoneMobile),
        contactService.updateTelephone(req.body.telephoneFax),
        contactService.updateTelephone(req.body.telephonePro),
        commonService.updateContactAdresse(req.body.adresse),
        contactService.updateContactQualification(id, req.body.qualification),
        contactService.updateContrat(id, req.body.contact)])
        .then(function (results) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log("Fail update contact");
            console.log(err);
            res.status(400).send(err);
        });
}

function deleteFiche(req, res) {
    pdfService.deleteContact(req.params._id)
        .then(function (results) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log("fichecontact could not be deleted");
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    Promise.all([contactService.deleteMailsById(req.params._id),
        contactService.deleteTelephonesById(req.params._id),
        commonService.deleteAdresseByContact(req.params._id),
        contactService.deleteContratsById(req.params._id),
        contactService.deleteLinkQualification(req.params._id),
        pdfService.deleteContact(req.params._id)])
        .then(function (results) {
            deleteContact();
        })
        .catch(function (err) {
            console.log("Fail deleting infos annexes");
            res.status(400).send(err);
        });


    function deleteContact() {
        contactService.delete(req.params._id)
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }


}

function getByIdencours(req, res) {
    contactService.getByIdencours(req.params.id_contact)
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

function getByIdchantier(req, res) {
    contactService.getByIdchantier(req.params.id_contact)
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

function getByIdContrat(req, res) {
    contactService.getByIdContrat(req.params.id_contact)
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

function getByIdLastContrat(req, res) {
    contactService.getByIdLastContrat(req.params.id_contact)
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

function addcontrat(req, res) {
    contactService.addcontrat(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function newcontrat(req, res) {
    contactService.newcontrat(req.body, req.params.id_contact)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdDevisclient(req, res) {
    contactService.getByIdDevisclient(req.params.id_contact)
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

function addForm(req, res) {
    //console.log("test3");
    contactService.addForm(req.body)
        .then(function () {
            res.send(200);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}

function getByIdNom(req, res) {
    contactService.getByIdNom(req.params.id_contact)
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

function getAllform(req, res) {
    //console.log("test3");
    contactService.getAllform()
        .then(function (formation) {
            res.send(formation);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllCaces(req, res) {
    //console.log("test");
    contactService.getAllCaces()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdFormation(req, res) {
    contactService.getByIdFormation(req.params.id_contact)
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

function addCaces(req, res) {
    console.log("test13");
    contactService.addCaces(req.body)
        .then(function () {
            res.send(200);
        })
        .catch(function (err) {
                res.status(400).send(err);
            }
        );
}

function getByIdCaces(req, res) {
    contactService.getByIdCaces(req.params.id_contact)
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

function upCaces(req, res) {
    //console.log("test3");
    contactService.upCaces(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function upFormation(req, res) {
    //console.log("test3");
    contactService.upFormation(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function equipement(req, res) {
    console.log('test');
    contactService.equipement(req.body, req.params.id_contact)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdequipement(req, res) {
    contactService.getByIdequipement(req.params.id_contact)
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

function deleteEquipement(req, res) {
    contactService.deleteEquipement(req.params.id_equipement)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}