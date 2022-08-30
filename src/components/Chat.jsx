import React, {Component} from 'react';
import io from 'socket.io-client'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ChannelList from './ChannelList.jsx';
import MessageList from './MessageList.jsx'
import UserList from './UserList.jsx';
import {withRouter} from 'react-router-dom';

const baseJSON = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': window.localStorage.getItem('ChatToken')
    }
};


class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            user: {},
            input: '',
            channels: ['default'],
            users: [],
            currentChannel: 'default',
            messages: [],
            socket: {},
            test: '',
            privateMessage: false,
            privateMessageTarget: ''
        };

        // get information for signed in user
        this.socket = io.connect('http://localhost:3000', {
            'query': 'token=' + window.localStorage.getItem('ChatToken')
        });

        this.socket.on('leave', this.leaveRoom);
        this.socket.on('join', this.joinRoom);
        this.socket.on('sendMessage', this.sendMessage);
        this.socket.on('chatmessage', this.receiveMessage);
        this.socket.on('joinedNewRoom', this.handleJoinRoomEvent);
        this.socket.on('updateMessages', this.handleUpdateMessages);
        this.socket.on('privateMessage', this.handleReceivePrivateMessage);
        this.socket.on('updateUsers', this.handleUpdateUsers);
        this.socket.on('refreshChannels', this.handleUpdateChannels)

    }

    handleReceivePrivateMessage = (message) => {
        let msg = JSON.parse(message);
        let localTarget = this.state.privateMessageTarget;
        if (this.state.privateMessage && (msg.target === localTarget || msg.user === localTarget)) {
            let msgs = this.state.messages;
            msgs.push(msg);
            this.setState({messages: msgs});
        }
    };

    handleUpdateMessages = (channel) => {
        this.getMessages(channel);
    };

    handleUpdateChannels = () => {
        this.getChannels();
    };


    handleUpdateUsers = () => {
        this.getUsers();
    };


    handleJoinRoomEvent = (room) => {
        //add room to users list of rooms
        let info = JSON.parse(room);
        let newChannels = this.state.channels;
        if (newChannels) {
            if (newChannels.indexOf(info.room) < 0) {
                newChannels.push(info.room);
                this.setState({channels: newChannels});
            }
            this.getMessages(info.room);
            this.getChannels();
        }

        if (newChannels.indexOf(info.room) < 0) {
            newChannels.push(info.room);
            this.setState({channels: newChannels});
        }
        this.getMessages(info.room);
        this.getChannels();


    };

    changeToPrivateMessageView = (e) => {
        e.preventDefault();
        this.setState({privateMessage: true, privateMessageTarget: e.target.innerText, messages: []});
    };


    extractUsernameFromToken = () => fetch('/api/decodeToken', baseJSON)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({username: responseJson.username});
            //finish calls to set up
            this.initialisationMethods();
        })
        .catch((err) => {
            console.log(err);
        });


    initialisationMethods = () => {
        this.getUserInfo(this.state.username);
        this.joinRoom('default');
        this.getMessages('default');
        this.getChannels();
        this.getUsers();
    };

    getUsers = () => fetch('/api/users', baseJSON)
        .then((response) => response.json())
        .then((responseJson) => {
            let users = [];
            responseJson.forEach(function (user) {
                users.push(user);
            });
            users = users.filter(function (item, index) {
                return users.indexOf(item) == index;
            });
            this.setState({users: users});
        })
        .catch((err) => {
            console.log(err);
        });

    componentDidMount = () => {
        //check user is defined
        if (typeof this.props.location.state != 'undefined') {
            let user = this.props.location.state.user.username;
            this.setState({username: user}, function () {
                this.initialisationMethods();
            });
        } else if (typeof window.localStorage.getItem('ChatToken') != 'undefined' && window.localStorage.getItem('ChatToken') != "null") {
            this.extractUsernameFromToken();
        } else {
            this.props.history.push({
                pathname: '/login',
                state: {
                    username: ''
                }
            });
        }
    };

    receiveMessage = (msg) => {
        let msgs = this.state.messages;
        if (JSON.parse(msg).channel === this.state.currentChannel) {
            msgs.push(JSON.parse(msg));
            this.setState({messages: msgs});
            document.body.scrollTop = document.body.scrollHeight;
        } else {
            //deal with a message for a room we arent current viewing
            //could put logic for little updates and stuff here
        }
    };

    getChannels = () => fetch('/api/channels', baseJSON)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({channels: responseJson});
        })
        .catch((err) => {
            console.log(err);
        });


    onChangeInput = (event) => {
        this.setState({input: event.target.value});
    };


    getMessages = (channelName) => fetch('/api/channel/' + channelName + '/messages', baseJSON)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({messages: responseJson});
        })
        .catch((err) => {
            console.log(err);
        });

    joinRoom = (room) => {
        let info = JSON.stringify({
            username: this.state.username,
            room: room
        });
        this.socket.emit('joinRoom', info);
    };


    leaveRoom = (room) => {
        this.socket.emit('leaveRoom', room);
    };

    sendMessage = () => {

        if (this.state.input.length < 1) {
            return;
        }

        if (this.state.privateMessage) {
            //handle private message
            let message = {
                text: this.state.input,
                timestamp: new Date().toString(),
                user: this.state.username,
                channel: 'privateMessage',
                target: this.state.privateMessageTarget
            };

            this.socket.emit('privateMessage', JSON.stringify(message));

        } else {
            //handle channel message
            let message = {
                text: this.state.input,
                timestamp: new Date().toString(),
                user: this.state.username,
                channel: this.state.currentChannel
            };

            this.socket.emit('message', JSON.stringify(message));
            this.getMessages(this.state.currentChannel);
        }

        this.setState({input: ''});
        window.scrollTo(0, document.body.scrollHeight);
    };

    changeActiveRoom = (e) => {
        e.preventDefault();
        this.setState({privateMessage: false});
        this.setState({privateMessageTarget: ''});
        let channelTarget = e.target.innerText.substring(1, e.target.innerText.length);
        if (channelTarget === this.state.currentChannel) {
            return;
        }
        //change room locally
        this.setState({currentChannel: channelTarget});
        this.joinRoom(channelTarget);
    };

    getUserInfo = (user) => fetch('/api/users/' + user, baseJSON)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({user: responseJson});
        })
        .catch((err) => {
            console.log(err);
        });

    componentDidUpdate = () => {
        if (window.localStorage.getItem('ChatToken') == null) {
            this.props.history.push({
                pathname: '/login',
                state: {
                    username: ''
                }
            });
        }
    };

    addChannel = (form) => {
        //broadcast join to new channel
        this.joinRoom(form.target.input.value);
        this.setState({currentChannel: form.target.input.value});
    };

    handleDelete = (value) => {
        value.preventDefault();
        this.socket.emit('deleteMessage', value.target.messageID.value);
    };

    logout = (e) => {
        this.socket.disconnect();
        e.preventDefault();
        window.localStorage.setItem('ChatToken', null);
        //navigate to chat page
        this.props.history.push({
            pathname: '/login',
            state: {
                username: ''
            }
        });
    };

    render() {
        return (
            <div className="chatApp">
                <div className="leftPane">
                    <a href="#" onClick={this.logout}>
                        <p>Logout</p>
                    </a>
                    <ChannelList
                        channels={this.state.channels}
                        user={this.state.username}
                        activeChannel={this.state.currentChannel}
                        setChannel={this.changeActiveRoom}
                        addChannel={this.addChannel}
                        joinRoom={this.joinRoom}
                    />
                    <UserList
                        users={this.state.users}
                        changeToPrivateMessageView={this.changeToPrivateMessageView}
                        target={this.state.privateMessageTarget}
                        privateMessage={this.state.privateMessage}
                    />
                </div>
                <div className="rightPane">
                    <MessageList
                        channel={this.state.currentChannel}
                        messages={this.state.messages}
                        handleDelete={this.handleDelete}
                        username={this.state.username}
                        privateMessage={this.privateMessage}
                        privateMessageTarget={this.privateMessageTarget}
                    />
                    <div className="inputArea">
                        <form onSubmit={this.sendMessage}>
                            <TextField
                                id="input"
                                value={this.state.input}
                                label="input"
                                onChange={this.onChangeInput}
                                style={{width: 500}}
                            />
                            <RaisedButton
                                type="submit"
                                label="send"
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Chat);
