//process.env.NODE_ENV = 'production';

require('./db').connect();

var db = require('./db.js').get();

require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the api
//app.use(expressJwt({ secret: config.secret }).unless({ path: ['/users/authenticate', '/users/register'] }));

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/contacts', require('./controllers/contacts.controller'));
app.use('/products', require('./controllers/achats.controller'));
app.use('/produits_vente', require('./controllers/ventes.controller'));
app.use('/messages', require('./controllers/message.controller'));
app.use('/chantier', require('./controllers/chantiers.controller'));
app.use('/commandes', require('./controllers/commandes.controller'));
app.use('/devis', require('./controllers/devis.controller'));
app.use('/facture', require('./controllers/facture.controller'));
app.use('/params', require('./controllers/params.controller'));
app.use('/planning', require('./controllers/planning.controller'));
app.use('/gantt', require('./controllers/gantt.controller'));

/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});*/

var path = require('path');
var crypto = require("crypto");
var multer = require('multer');
var fs = require('fs');
var DIR = './files/';
var DIRimg = './images/';
var Q = require('q');


app.get('/image', function(req, res, next){
    res.send("test test")
});

/******************IMAGES********************************/
var storageImg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIRimg)
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' + getFileExtension(file.originalname); // url
            cb(null, url);
        });
    }
});
var uploadImg = multer({storage: storageImg});

app.options('/image');

// IMAGES FICHE CONTACTS
app.get('/image/contact/:id_contact/:nom_fichier', function (req, res) {
    res.sendFile(path.join(__dirname, 'images', req.params.nom_fichier));
});




app.post('/image/contact/:id', uploadImg.any(), function (req, res, next) {
    console.log(req.files[0].filename);
    db.query ("UPDATE contact SET image_url = ? WHERE id_contact = ?", [req.files[0].filename, req.params.id]);
    res.end('image uploaded');
});

// IMAGES FICHE PRODUITS ACHAT / AJOUT PRODUIT ACHAT
app.get('/image/img/:id/:nom_fichier', function (req, res) {
    console.log("get img"+req.params.nom_fichier,req.params.id_produit);

    res.sendFile(path.join(__dirname, 'images', req.params.nom_fichier));

});

app.post('/image/img/:id', uploadImg.any(), function (req, res, next) {

    db.query ("UPDATE produit SET image_url = ? WHERE id_produit = ?", [req.files[0].filename, req.params.id]);
    console.log("post img"+req.files[0].filename, req.params.id_produit);

    res.end('image uploaded');
});

// IMAGES FICHE PRODUITS VENTE / AJOUT PRODUIT VENTE
app.get('/image/produitv/:id_prc/:nom_fichier', function (req, res) {
    res.sendFile(path.join(__dirname, 'images', req.params.nom_fichier));
});

app.post('/image/produitv/:id', uploadImg.any(), function (req, res, next) {
    console.log(req.files[0].filename);
    db.query ("UPDATE produit_vente SET image = ? WHERE id_prc = ?", [req.files[0].filename, req.params.id]);
    res.end('image uploaded');
});

// IMAGES FICHE VEHIMAT / AJOUT VEHIMAT
app.get('/image/matvehi/:id_vehmat/:nom_fichier', function (req, res) {
   console.log("get"+req.params.nom_fichier);

    res.sendFile(path.join(__dirname, 'images', req.params.nom_fichier));
});

app.post('/image/matvehi/:id', uploadImg.any(), function (req, res, next) {
    console.log(req.files[0].filename);
    db.query ("UPDATE Vehiculemateriel SET image_vh = ? WHERE id_vehmat = ?", [req.files[0].filename, req.params.id]);
    res.end('image uploaded');
});

// LOGO DEFINI DANS PARAMETRES GENERAUX
app.get('/image/agence/:id_agence/:nom_fichier', function (req, res) {
    res.sendFile(path.join(__dirname, 'images', req.params.nom_fichier));
});

app.post('/image/agence/:id', uploadImg.any(), function (req, res, next) {
    //console.log(req.files[0].filename);
    db.query ("UPDATE agence SET image = ? WHERE id_agence = ?", [req.files[0].filename, req.params.id]);
    //console.log(req.params.id);
    res.end('logo uploaded');
});

// Filigrane
var storageFili = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIRimg)
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' + getFileExtension(file.originalname); // url
            cb(null, url);
        });
    }
});
var uploadFili = multer({storage: storageFili});

app.options('/image');
/******************GED CONTACT***************************/
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        //console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' +getFileExtension(file.originalname); // url
            var nom = file.originalname; // url
            var id_contact = req.params.id;

            addFiletoDbct(url, nom , id_contact);

            console.log(req.params);
            cb(null, url);
        });
    }
});

var upload = multer({storage: storage});

function addFiletoDbct(url, nom , id_contact){
    var deferred = Q.defer();

    db.query("INSERT INTO contact_ged (url, nom, id_contact) VALUES (?, ?, ?)",
        [url, nom, id_contact], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve();
        });
    return deferred.promise;
}
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

app.options('/ged');

app.get('/ged/contact/:id_contact/:nom_fichier', function(req, res) {
    res.sendFile(path.join(__dirname, 'files', req.params.nom_fichier));
});

app.get('/ged/contact/:id_contact', function(req, res) {
    var deferred = Q.defer();

    db.query("SELECT * from contact_ged WHERE id_contact = ?",
        [req.params.id_contact], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve(results);
            res.send(results);
        });
    return deferred.promise;
});

app.get('/ged', function(req, res) {
    res.end('file catcher example');
});

app.post('/ged/contact/:id', upload.any(), function(req, res, next) {
    //console.log(req);
    res.end('file uploaded');
});

/**********************GED CHANTIER******************************/

var storagech = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        //console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' +getFileExtension(file.originalname); // url
            var nom = file.originalname; // url
            var id_chantier = req.params.id;

            addFiletoDbch(url, nom , id_chantier);

            console.log(req.params);
            cb(null, url);
        });
    }

});

var upload = multer({ storage: storagech });

function addFiletoDbch(url, nom , id_chantier){
    var deferred = Q.defer();

    db.query("INSERT INTO chantier_ged (url, nom, id_chantier) VALUES (?, ?, ?)",
        [url, nom, id_chantier], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve();
        });

    return deferred.promise;
}

app.get('/ged/chant/:id_chantier/:nom_fichier', function(req, res) {
    res.sendFile(path.join(__dirname, 'files', req.params.nom_fichier));
});

app.get('/ged/chant/:id_chantier', function(req, res) {
    var deferred = Q.defer();

    db.query("SELECT * from chantier_ged WHERE id_chantier = ?",
        [req.params.id_chantier], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve(results);
            res.send(results);
        });

    return deferred.promise;
});

app.post('/ged/chant/:id', upload.any(), function(req, res, next) {
    //console.log(req);
    res.end('file uploaded');
});

/**********************GED Vehicule matériel******************************/
var storagevh = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        //console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' +getFileExtension(file.originalname); // url
            var nom = file.originalname; // url

            var id_vehmat = req.params.id_vehmat;
            console.log ('GEDserver :'+id_vehmat);

            addFiletoDbpvh(url, nom , id_vehmat);

            console.log('GEDserver2'+ req.params);
            cb(null, url);
        });
    }
});

var upload = multer({ storage: storagevh });

function addFiletoDbpvh(url, nom , id_vehmat){
    var deferred = Q.defer();

    db.query("INSERT INTO vehimat_ged (url, nom, id_vehmat) VALUES (?, ?, ?)",
        [url, nom, id_vehmat], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve();
        });

    return deferred.promise;
}

app.get('/ged/matvehi/:id_vehmat/:nom_fichier', function(req, res) {
    res.sendFile(path.join(__dirname, 'files', req.params.nom_fichier));
});

app.get('/ged/matvehi/:id_vehmat', function(req, res) {
    var deferred = Q.defer();

    db.query("SELECT * from vehimat_ged WHERE id_vehmat = ?",
        [req.params.id_vehmat], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve(results);
            res.send(results);
        });

    return deferred.promise;
});

app.post('/ged/matvehi/:id_vehmat', upload.any(), function(req, res, next) {
    //console.log(req);
    res.end('file uploaded');
});

/**********************GED PRODUIT ACHAT******************************/
var storageac = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        //console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' +getFileExtension(file.originalname); // url
            var nom = file.originalname; // url

            var id_produit = req.params.id_produit;
            console.log ('GEDserver :'+id_produit);

            addFiletoDbpro(url, nom , id_produit);

            console.log('GEDserver2'+ req.params);
            cb(null, url);
        });
    }
});

var upload = multer({ storage: storageac });

function addFiletoDbpro(url, nom , id_produit){
    var deferred = Q.defer();

    db.query("INSERT INTO produit_ged (url, nom, id_produit) VALUES (?, ?, ?)",
        [url, nom, id_produit], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve();
        });
    return deferred.promise;
}

app.get('/ged/produits/:id_produit/:nom_fichier', function(req, res) {
    res.sendFile(path.join(__dirname, 'files', req.params.nom_fichier));
});

app.get('/ged/produits/:id_produit', function(req, res) {
    var deferred = Q.defer();

    db.query("SELECT * from produit_ged WHERE id_produit = ?",
        [req.params.id_produit], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve(results);
            res.send(results);
        });
    return deferred.promise;
});

app.post('/ged/produits/:id_produit', upload.any(), function(req, res, next) {
    //console.log(req);
    res.end('file uploaded');
});

/**********************GED devis******************************/
var storagedev = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        //console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' +getFileExtension(file.originalname); // url
            var nom = file.originalname; // url

            var id = req.params.id;

            addFiletoDbdev(url, nom , id);

            console.log(req.params);
            cb(null, url);
        });
    }
});

var upload = multer({ storage: storagedev });

function addFiletoDbdev(url, nom , id){
    var deferred = Q.defer();

    db.query("INSERT INTO devis_ged (url, nom) VALUES (?, ?)",
        [url, nom, id], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve();
        });

    return deferred.promise;
}
app.options('/ged');
app.get('/ged/dev/:id/:nom_fichier', function(req, res) {
    res.sendFile(path.join(__dirname, 'files', req.params.nom_fichier));
});

app.get('/ged/dev/:id', function(req, res) {
    var deferred = Q.defer();

    db.query("SELECT * from devis_ged ",
        [req.params.id_produit], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve(results);
            res.send(results);
        });

    return deferred.promise;
});

app.get('/ged', function(req, res) {
    res.end('file catcher example');
});
app.post('/ged/dev/:id_geddev', upload.any(), function(req, res, next) {


    //console.log(req);
    res.end('file uploaded');
});

/**********************GED facture******************************/
var storagefac = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        //console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' +getFileExtension(file.originalname); // url
            var nom = file.originalname; // url

            var id_factged = req.params.id_factged;

            addFiletoDbfac(url, nom , id_factged);

            console.log(req.params);
            cb(null, url);
        });
    }
});

var upload = multer({ storage: storagefac });

function addFiletoDbfac(url, nom , id_factged){
    var deferred = Q.defer();

    db.query("INSERT INTO fact_ged (url, nom) VALUES (?, ?)",
        [url, nom, id_factged], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve();
        });

    return deferred.promise;
}
app.options('/ged');
app.get('/ged/fac/:id_factged/:nom_fichier', function(req, res) {
    res.sendFile(path.join(__dirname, 'files', req.params.nom_fichier));
});

app.get('/ged/fac/:id_factged', function(req, res) {
    var deferred = Q.defer();

    db.query("SELECT * from fact_ged ",
        [req.params.id_produit], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve(results);
            res.send(results);
        });
    return deferred.promise;
});

app.get('/ged', function(req, res) {
    res.end('file catcher example');
});
app.post('/ged/fac/:id_factged', upload.any(), function(req, res, next) {
    //console.log(req);
    res.end('file uploaded');
});

/**********************GED param******************************/
var storagepr = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        //console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var url = raw.toString('hex') + Date.now() + '.' +getFileExtension(file.originalname); // url
            var nom = file.originalname; // url

            var id_param_ged = req.params.id_param_ged;

            addFiletoDbpr(url, nom , id_param_ged);

            console.log(req.params);
            cb(null, url);
        });
    }
});

var upload = multer({ storage: storagepr });

function addFiletoDbpr(url, nom,id_param_ged){
    var deferred = Q.defer();

    db.query("INSERT INTO param_ged (url, nom) VALUES (?, ?)",
        [url, nom, id_param_ged], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve();
        });

    return deferred.promise;
}

app.options('/ged');
app.get('/ged/param/:id_param_ged/:nom_fichier', function(req, res) {
    res.sendFile(path.join(__dirname, 'files', req.params.nom_fichier));
});

app.get('/ged/param/:id_param_ged', function(req, res) {
    var deferred = Q.defer();

    db.query("SELECT * from param_ged ",
        [req.params.id_param_ged], function (error, results, fields) {
            if (error) deferred.reject('MySql ERROR trying to update user informations (1) | '+ error.message);
            deferred.resolve(results);
            res.send(results);
        });

    return deferred.promise;
});

app.get('/ged', function(req, res) {
    res.end('file catcher example');
});
app.post('/ged/param/:id_param_ged', upload.any(), function(req, res, next) {
    res.end('file uploaded');
});

// start server
//var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var port = 4000;

var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

module.exports = server;
