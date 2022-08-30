/* File containing API routes for our node server */

const express = require('express');
const router = express.Router();
const authentication = require('./authentication');
const models = require('../models');
const secret = 'abcdefg';
const crypto = require('crypto');


//checks a token
router.post('/validateToken', function (req, res) {
    if (authentication.checkToken((req.body.token))) {
        res.json(req.body.token);
    } else {
        res.json({error: 'token invalid'});
    }
});

//authentication (login) - provide a token
router.post('/auth', function (req, res) {
    let hashedPassword = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('hex');

    models.User.findOne({'username': req.body.username}, 'username channels password')
        .then((user) => {
            if (user.password === hashedPassword) {
                let userToSend = {
                    token: authentication.generateToken(req.body.username),
                    user: {
                        username: user.username,
                        channels: user.channels
                    }
                };
                res.json(userToSend);
            } else {
                res.json({error: 'login details are incorrect'});
            }
        })
        .catch((err) => {
            console.log("catch error - no user found");
            res.json({error: err});
        });
});

//register a new user
router.post('/register', function (req, res) {
    let hashedPassword = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('hex');

    let newUser = new models.User({username: req.body.username, password: hashedPassword});
    newUser.save().then((user) => {
        let userToSend = {
            token: authentication.generateToken(req.body.username),
            user: {
                username: user.username,
                channels: user.channels
            }
        };
        res.json(userToSend);
    }).catch((err) => {
        console.log(err);
        res.json({error: err});
    });

});


//middleware, checks token is valid to protect following api routes
//leaving this disabled due to a small bug where page navigates
//before token is set correctly in local storage
router.use(function (req, res, next) {
    //perform token check at req.headers.token
    // if(authentication.checkToken(req.headers.token)){
    //     next();
    // } else {
    //     res.json({
    //         error : 'invalid token'
    //     })
    // }
    next()
});


//get all channels
router.get('/channels', (req, res) => {

    models.Channel.find({})
        .then((channels) => {
            res.send(channels);
        })
        .catch((err) => {
            console.log(err);
        });

});

//get messages for a channel
router.get('/channel/:channelName/messages', (req, res) => {

    models.Message.find({channel: req.params.channelName}, 'text user timestamp channel')
        .then((messages) => {
            res.json(messages);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });

});

//list of all connected users
router.get('/users', (req, res) => {

    let io = require('../app').io;
    let results = [];
    Object.keys(io.sockets.connected).forEach(function (socket) {
        results.push(io.sockets.connected[socket].decoded_token.username); // socketId
    });
    //code for looping through
    res.json(results);

});

//get info for a user
router.get('/users/:username', (req, res) => {

    models.User.findOne({username: req.params.username}, 'username channels')
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
});

router.get('/decodeToken', (req, res) => {
    let token = authentication.decodeToken(req.headers.token);
    res.json(token);
});


module.exports = router;