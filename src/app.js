const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketioJwt = require('socketio-jwt');
const path = require('path');
const index = require(path.join(__dirname,'routes','index.js'));
const socketActions = require(path.join(__dirname,'routes','socketIO.js'));
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const initialisation = require('./routes/initialisation');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//static resource path
app.use('/static', express.static('public'));

//send our app - basic operation
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname,'views','index2.html'));
});


//main paths
app.use('/', index);

//include out socket actions
socketActions(io,socketioJwt);

//DB settings go here
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/HomelikeChatApp');

//setup default info
initialisation();


http.listen(3000, function(){
    console.log('listening on *:3000');
});

module.exports = {io, http};