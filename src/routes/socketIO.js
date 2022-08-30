const models = require('../models');

module.exports = function (io, ioJwt) {

    //socket authentication
    io.use(ioJwt.authorize({
        secret: 'abcdefg',
        handshake: true
    }));

    //describing what to do on socket actions
    io.on('connection', function (socket) {
        console.log('user connected');

        socket.broadcast.emit('updateUsers');

        socket.on('disconnect', function () {
            socket.broadcast.emit('updateUsers');
        });

        socket.on('message', function (msg) {
            let parsedMsg = JSON.parse(msg);
            let messageToSave = new models.Message(parsedMsg);
            messageToSave.save().then((e) => {
            })
                .catch((err) => {
                    console.log(err);
                });
            socket.broadcast.to(parsedMsg.channel).emit('chatmessage', msg);
        });


        socket.on('joinRoom', function (room) {
            let info = JSON.parse(room);
            socket.join(info.room);
            socket.emit('joinedNewRoom', room);

            //on mongoose add channel to User, using User
            models.User.findOne({username: info.username})
                .then((user) => {
                    user.addChannel(info.room);
                    return user.save()
                })
                .catch((err) => {
                    console.log(err);
                });

            //create new Channel in DB - catch error if already exists
            let newChannel = new models.Channel({name: info.room});
            newChannel.save()
                .catch((err) => {
                    //console.log("channel already exists");
                });

            socket.broadcast.emit('refreshChannels');

        });

        socket.on('leaveRoom', function (room) {
            socket.leave(room);
            //remove from models
        });

        socket.on('deleteMessage', function (messageID) {

            models.Message.findOne({_id: messageID})
                .then((msg) => {
                    if (msg.user === socket.decoded_token.username) {
                        return;
                    }
                });

            models.Message.findOneAndRemove({_id: messageID})
                .then((removed) => {
                    io.in(removed.channel).emit('updateMessages', removed.channel);
                })
                .catch((err) => {
                    console.log(err);
                });
        });

        socket.on('editMessage', function (messageID) {
            models.Message.findOne({_id: messageID, username: socket.decoded_token.username})
                .then((msg) => {
                    //edit message

                    //save message
                })
                .catch((err) => {
                    console.log(err);
                })
        });

        socket.on('privateMessage', function (message) {

            let parsedMessage = JSON.parse(message);

            Object.keys(io.sockets.connected).forEach(function (socket) {
                let socketUser = io.sockets.connected[socket].decoded_token.username;
                if (parsedMessage.user === socketUser) {
                    io.sockets.connected[socket].emit('privateMessage', message);
                } else if (parsedMessage.target === socketUser) {
                    io.sockets.connected[socket].emit('privateMessage', message);
                }
                // socketId
            });

            //could save personal message here

            //loop through and broadcast to correct people

        });


    });

};