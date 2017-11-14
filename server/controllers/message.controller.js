/**
 * Created by Wbat on 04/06/2017.
 */
var config = require('config.json');
var express = require('express');
var router = express.Router();
var messageService = require('services/message.service');

// routes
router.post('/new', add);
router.get('/:_id', getAll);
router.get('/id/:_id', getMessage);
router.get('/conversation/:_id', getConversation);
//router.put('/:_id', update);
router.delete('/:_id', _delete);
router.post('/answer', answer);
router.get('/unread/:id', unreadMsg);
router.get('/home/:_id',getAllHome);

module.exports = router;


function unreadMsg(req, res) {
    messageService.getUnreadMsg(req.params.id)
        .then(function (msg) {
            res.send(msg);
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send(err);
        });
}

function answer(req, res) {

    messageService.answer(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send(err);
        });
}


function add(req, res) {

    messageService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send(err);
        });
}

function getConversation(req, res) {

    messageService.getConversation(req.params._id)
        .then(function (conversation) {
           //console.log(conversation);
            if (conversation) {
                res.send(conversation);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    //console.log(req.params._id);
    messageService.getAll(req.params._id)
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllHome(req, res) {
    //console.log(req.params._id);
    messageService.getAllHome(req.params._id)
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getMessage(req, res) {

    console.log(req.params._id);
    messageService.getById(req.params._id)
        .then(function (message) {
            if (message) {
                res.send(message);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}



function _delete(req, res) {
    messageService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
