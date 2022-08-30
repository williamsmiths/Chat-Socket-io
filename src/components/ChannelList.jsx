import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Styles from 'material-ui/styles/colors'

class ChannelList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            input : '',
            channels : []
        }
    }


    onClick = (e) => {
        if(this.state.channels.indexOf(e.target.input.value)<0){
            let channels = this.state.channels;
            channels.push(e.target.input.value);
            this.setState({channels:channels});

            if(e.target.input.value.length>0){
                this.props.addChannel(e);
                this.setState({input: ''});
            }

        }
    };

    renderChannelList = () => this.props.channels.map((channel,index) => {
        if(typeof channel.name != 'undefined'){
            if(this.props.activeChannel === channel.name){
                return (
                    <div key={index} className="activeChannelListItem">
                        <li>
                            <a href="#" onClick={this.props.setChannel}>
                                <p>#{channel.name}</p>
                            </a>
                        </li>
                    </div>
                );
            }
            return (
                <div key={index}>
                    <li>
                        <a href="#" onClick={this.props.setChannel}>
                            <p>#{channel.name}</p>
                        </a>
                    </li>
                </div>

            );
        }
    });


    onChangeInput = (event) => {
        this.setState({input : event.target.value});
    };

    render() {
        return (
            <div className="channelList">
                <div className="channelListHeader">
                    <div className="channelListHeaderTitle">
                        <h4>Channels</h4>
                    </div>
                </div>
                <div>
                    <ul>
                        {this.renderChannelList()}
                    </ul>
                </div>
                <div className="channelListHeaderButton">
                    <p>Add new channel</p>
                        <form onSubmit={this.onClick}>
                            <TextField
                                id="input"
                                value={this.state.input}
                                label="input"
                                onChange={this.onChangeInput}
                                style={{width:100}}
                            />
                            <FlatButton
                                type="submit"
                                label="Add"
                            />
                        </form>
                </div>
            </div>

        );
    }
}

export default ChannelList;
