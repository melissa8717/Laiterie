var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/upuser',modifdroit);
router.put('/:_id', update);
router.delete('/:_id', _delete);


router.get('/utilisation',getAllUser);
router.put('/test/:id',updateUser);
router.get('/compte',getCount);
router.get('/test/:id',getCurrentnb);

router.post('/droit/:id',createdroit);





module.exports = router;


function authenticate(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllUser(req, res) {
    //console.log('dieu');
    userService.getAllUser()
        .then(function (util) {
            res.send(util);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    //console.log('toto');
    userService.updateUser(req.params.id,req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCount(req, res) {
    //console.log('dieu');
    userService.getCount()
        .then(function (util) {
            res.send(util);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentnb(req, res) {
    //console.log('dieu');
    userService.getCurrentnb(req.params.id)
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

function createdroit(req, res) {
   // console.log("test3");
    userService.createdroit(req.body,req.params.id)
        .then(function (results) {
            res.send(results);
        })
        .catch(function (err) {
            res.status(400).send(err);}
        );
}

function modifdroit(req, res) {
    //console.log('toto1')
    userService.modifdroit(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
