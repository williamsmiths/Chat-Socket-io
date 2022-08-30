import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';

class MessageList extends React.Component {

    constructor(props){
        super(props);

    }

    componentDidUpdate = () => {
       this.anchorMessage.focus();
       let elm = document.getElementById('messageList');
       elm.scrollTop = elm.scrollHeight;
    };


    deleteButton = (message) => {
        if(this.props.username == message.user){
            return (
                <div className="deleteButton">
                    <form onSubmit={this.props.handleDelete} >
                        <input name ='messageID' type="hidden" value={message._id || ''}/>
                        <IconButton
                            type="submit"
                            iconClassName="fa fa-times fa-lg"
                        />
                    </form>
                </div>
            );
        }
    };


    renderMessageList = () => this.props.messages.map((message,index) => {



        //if previous message is from same sender dont render the name
        if(index>0 && this.props.messages[index-1].user === message.user){
            return (
                <div className="individualMessage" key={index}>
                    <li>
                        <div className ="messageLine">
                            <div className="timeStamp">
                                <p>{message.timestamp}</p>
                            </div>
                            <div className="messageText">
                                <p>{message.text}</p>
                            </div>
                            {this.deleteButton(message)}
                        </div>
                    </li>
                </div>
            );
        } else {
            return (
                <div className="individualMessage" key={index}>
                    <li>
                        <div className="sender">
                            <p>{message.user}</p>
                        </div>
                        <div className="messageLine">
                            <div className="timeStamp">
                                <p>{message.timestamp}</p>
                            </div>
                            <div className="messageText">
                                <p>{message.text}</p>
                            </div>
                            {this.deleteButton(message)}
                        </div>
                    </li>
                </div>
            );
        }
    });

    render() {
        return (
            <div className="messageList" ref={(list) => {this.list = list}} id="messageList">
                <p>{this.props.channel}</p>
                <div>
                    <ul>
                    {this.renderMessageList()}
                    </ul>
                    <div ref={(anchorMessage) => {this.anchorMessage = anchorMessage}}>
                </div>
                </div>
            </div>

        );
    }
}

export default MessageList;