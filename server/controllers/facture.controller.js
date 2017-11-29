/**
 * Created by cédric on 10/07/2017.
 */
var express = require('express');
var router = express.Router();
var factureService = require('services/facture.service');

router.get('/listefacture', getAllFacture);
router.get('/modifierfacture', getAllFooter);
router.get('/nfact/', getAllnfact);

router.get('/editer_facture/:id_devis', getByIdFacture);
router.get('/retenu/:id_devis', getByIdRetenu);
router.get('/version/:id_devis/:num_version', getByIdVersion);
router.get('/detail/:id_devis/:num_version', getByIdDetail);
router.get('/option/:id_devis/:num_version', getByIdOption);
router.get('/totalfacture/:id_devis/:num_version', getByIdTotalfact);
router.get('/totaloption/:id_devis/:num_version', getByIdTotalopt);
router.post('/add', add);

router.get('/modif/:id_facture/:n_situation', getByIdModif);
router.get('/situation/:id_facture/:n_situation', getByIdSituation);
router.get('/totalsit/:id_facture/:n_situation', getByIdTotalSit);
router.get('/valeur/:id_facture', getByIdValeur);
router.get('/sitopt/:id_facture/:n_situation', getByIdSitoption);
router.get('/siteuption/:id_facture/:n_situation', getByIdOptSit);
router.post('/new/:id_facture', createSituation);

router.get('/listechantierfact/:id_chantier', getByIdListeFacture);
router.get('/nom/:id_chantier', getByIdNom);
router.get('/fournisseur', getAllFournisseur);
router.get('/bdcdetail', getAllBdcdetail);
router.post('/addbdc', createfacturefournisseur);
router.get('/mois/:month/:year', getAllMois);
router.get('/lfournisseur/:id_factfour', getByIdFournisseur);
router.get('/bdc/:id_factfour', getByIdBDC);
router.put('/modifbdc', updateBDC);

router.get('/categoriefrais', getALLFraiscategorie);
router.post('/addfrais', addfrais);
router.get('/fraismois/:month/:year', getAllFraismois);
router.put('/ajoutfrais', updateFraismois);
router.delete('/delfrais/:id_frais', deleteFrais);

router.post('/addprev', addprev);
router.get('/prev/:month/:year', getAllPrev);

router.get('/annee/:year', getAllAnnee);
router.get('/yprev/:year', getAllYprev);

router.get('/totalfact/:year', getAlltotalfact);
router.get('/totaldevis/:year', getAlltotaldevis);
router.get('/devisachat/:year', getAlldevisachat);
router.get('/optionachat/:year', getAllOptionachat);
router.get('/frainan/:year', getAllFraisan);
router.get('/moan/:year', getAllMoan);
router.get('/bdcreel/:year', getAllBdcreel);
router.get('/annnefrais/:year', getAllAnnefrais);

router.get('/fraispour', getAllFraispour);


router.get('/primopt/:id_facture/:n_situation', getByIdPrimOpt);
router.get('/primsit/:id_facture/:n_situation', getByIdPrimSit);
router.get('/accompte/:id_facture/:n_situation', getByIdAccpt);

router.get('/avoir', getAllNavoir);
router.post('/addavoir', addavoir);
router.get('/listavoir', getAllListavoir);
router.get('/impravoir/:id_avoir', getByIdAvoir);
router.get('/avoiprim/:id_avoir', getByIdPeodavoir);
router.get('/avlibreiprim/:id_avoir',getByIdPeodavlibre);

router.post('/acote', addacompte);
router.get('/acolist/:id_facture/:n_situation', getByIdAcopmte);

router.post('/libreadd',Flibre);
router.get('/libmodif/:id_facture/:n_situation',getByIdLibreModif);
router.get('/Librebase/:id_facture/:n_situation',getByIdLibrebase);
router.get('/Libredetail/:id_facture/:n_situation',getByIdLibredetail);
router.get('/sumlibre/:id_facture',getByIdLibresum);
router.post('/createlibre/:id_facture',createSituationlibre);
router.get('/imprimsitlibre/:id_facture/:n_situation',getByIdLibresumimprim);
router.get('/Libreimpribase/:id_facture/:n_situation',getByIdLibrebaseimprim);
router.get('/Libredetimprim/:id_facture/:n_situation',getByIdLibredetailimprim);

router.get('/Libreavoir/:id_facture/:n_situation',getByIdAvoirlibre);
router.post('/adavoirlibre',addavoirlibre);

router.get('/devislibre/:id_devis/:num_version',getByIdDevislibre);
router.get('/optionlibre/:id_devis/:num_version',getByIdDevislibreoption);
router.get('/getByIdlibresituation/:id_facture/:n_situation',getByIdlibresituation);
router.get('/getByIdlibresituationoption/:id_facture/:n_situation',getByIdlibresituationoption);
router.get('/byIdTotlafacture/:id_facture/:n_situation',getByIdTotlafact);
router.get('/getByIdTotlaTVA/:id_facture/:n_situation',getByIdTotlaTVA);

module.exports = router;

function getAllFacture(req, res) {



    factureService.getAllFacture()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFooter(req, res) {
    factureService.getAllFooter()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllnfact(req, res) {
    factureService.getAllnfact()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdFacture(req, res) {
    factureService.getByIdFacture(req.params.id_devis, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdRetenu(req, res) {
    factureService.getByIdRetenu(req.params.id_devis, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdVersion(req, res) {
    factureService.getByIdVersion(req.params.id_devis, req.params.num_version, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdDetail(req, res) {
    factureService.getByIdDetail(req.params.id_devis, req.params.num_version, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdOption(req, res) {
    factureService.getByIdOption(req.params.id_devis, req.params.num_version, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdTotalfact(req, res) {
    factureService.getbyIdTotalfact(req.params.id_devis, req.params.num_version)
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

function getByIdTotalopt(req, res) {
    factureService.getbyIdTotalopt(req.params.id_devis, req.params.num_version)
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

function add(req, res) {
    factureService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*---------------------------------modifier facture----------------*/

function getByIdModif(req, res) {
    factureService.getByIdModif(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdSituation(req, res) {
    factureService.getByIdSituation(req.params.id_facture, req.params.n_situation, req.body)
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

function getByIdSitoption(req, res) {
    factureService.getByIdSitoption(req.params.id_facture, req.params.n_situation, req.body)
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

function getByIdTotalSit(req, res) {
    factureService.getByIdTotalSit(req.params.id_facture, req.params.n_situation, req.body)
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

function getByIdOptSit(req, res) {
    factureService.getByIdOptSit(req.params.id_facture, req.params.n_situation, req.body)
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

function getByIdValeur(req, res) {
    factureService.getByIdValeur(req.params.id_facture, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createSituation(req, res) {
    factureService.createSituation(req.params.id_facture, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*-----------------------------Liste facture chantier-------------------------------------*/

function getByIdListeFacture(req, res) {
    factureService.getByIdListeFacture(req.params.id_chantier, req.body)
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

function getByIdNom(req, res) {
    factureService.getByIdNom(req.params.id_chantier)
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

/*---------------------------facture fournisseur-------------------------------------------*/

function getAllFournisseur(req, res) {
    factureService.getAllFournisseur()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllBdcdetail(req, res) {
    factureService.getAllBdcdetail()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*---------------liste facture fournisseur----------------------------------------*/

function createfacturefournisseur(req, res) {
    factureService.createfacturefournisseur(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllMois(req, res) {
    factureService.getAllMois(req.params.month, req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*------------------------------------fournisseur-----------------------------------------*/
function getByIdFournisseur(req, res) {
    factureService.getByIdFournisseur(req.params.id_factfour)
        .then(function (fact) {
            if (fact) {
                res.send(fact);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdBDC(req, res) {
    factureService.getByIdBDC(req.params.id_factfour)
        .then(function (fact) {
            if (fact) {
                res.send(fact);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateBDC(req, res) {
    factureService.updateBDC(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*-------------------------------------frais mois -----------------------------------*/
function getALLFraiscategorie(req, res) {
    factureService.getALLFraiscategorie()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addfrais(req, res) {
    factureService.addfrais(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFraismois(req, res) {
    factureService.getAllFraismois(req.params.month, req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateFraismois(req, res) {
    factureService.updateFraismois(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteFrais(req, res) {
    factureService.deleteFrais(req.params.id_frais)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllPrev(req, res) {
    factureService.getAllPrev(req.params.month, req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addprev(req, res) {
    factureService.addprev(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllAnnee(req, res) {
    factureService.getAllAnnee(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllYprev(req, res) {
    factureService.getAllYprev(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAlltotalfact(req, res) {
    factureService.getAlltotalfact(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAlltotaldevis(req, res) {
    factureService.getAlltotaldevis(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAlldevisachat(req, res) {
    factureService.getAlldevisachat(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllOptionachat(req, res) {
    factureService.getAllOptionachat(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFraisan(req, res) {
    factureService.getAllFraisan(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllMoan(req, res) {
    factureService.getAllMoan(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllBdcreel(req, res) {
    factureService.getAllBdcreel(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllAnnefrais(req, res) {
    factureService.getAllAnnefrais(req.params.year)
        .then(function (Chantier) {
            res.send(Chantier);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFraispour(req, res) {
    factureService.getAllFraispour()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


/****************************************************************************Imprimer*************************************************************************************/

function getByIdPrimSit(req, res) {
    factureService.getByIdPrimSit(req.params.id_facture, req.params.n_situation, req.body)
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

function getByIdPrimOpt(req, res) {
    factureService.getByIdPrimOpt(req.params.id_facture, req.params.n_situation, req.body)
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

function getByIdAccpt(req, res) {
    factureService.getByIdAccpt(req.params.id_facture, req.params.n_situation, req.body)
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

/***************************************AVOIR****************************************************************************/
function getAllNavoir(req, res) {
    factureService.getAllNavoir()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addavoir(req, res) {
    factureService.addavoir(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllListavoir(req, res) {
    factureService.getAllListavoir()
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdAvoir(req, res) {
    factureService.getByIdAvoir(req.params.id_avoir, req.body)
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

function getByIdPeodavoir(req, res) {
    factureService.getByIdPeodavoir(req.params.id_avoir, req.body)
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

function getByIdPeodavlibre(req, res) {
    factureService.getByIdPeodavlibre(req.params.id_avoir, req.body)
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

function addacompte(req, res) {
    factureService.addacompte(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdAcopmte(req, res) {
    factureService.getByIdAcopmte(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/*********************libre ***********************************************/
function Flibre(req, res) {
    factureService.Flibre(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibreModif(req, res) {
    factureService.getByIdLibreModif(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibrebase(req, res) {
    factureService.getByIdLibrebase(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibredetail(req, res) {
    factureService.getByIdLibredetail(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibresum(req, res) {
    factureService.getByIdLibresum(req.params.id_facture, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createSituationlibre(req, res) {
    factureService.createSituationlibre(req.params.id_facture, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibresumimprim(req, res) {
    factureService.getByIdLibresumimprim(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibrebaseimprim(req, res) {
    factureService.getByIdLibrebaseimprim(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLibredetailimprim(req, res) {
    factureService.getByIdLibredetailimprim(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdAvoirlibre(req, res) {
    factureService.getByIdAvoirlibre(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addavoirlibre(req, res) {
    factureService.addavoirlibre(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdDevislibre(req, res) {
    factureService.getByIdDevislibre(req.params.id_devis, req.params.num_version, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdDevislibreoption(req, res) {
    factureService.getByIdDevislibreoption(req.params.id_devis, req.params.num_version, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdlibresituation(req, res) {
    factureService.getByIdlibresituation(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdlibresituationoption(req, res) {
    factureService.getByIdlibresituationoption(req.params.id_facture, req.params.n_situation, req.body)
    .then(function (devis) {
        if (devis) {
            res.send(devis);
        } else {
            res.sendStatus(404);
        }
    })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdTotlafact(req, res) {
    factureService.getByIdTotlafact(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdTotlaTVA(req, res) {
    factureService.getByIdTotlaTVA(req.params.id_facture, req.params.n_situation, req.body)
        .then(function (devis) {
            if (devis) {
                res.send(devis);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}