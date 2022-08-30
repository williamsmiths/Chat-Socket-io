import React, {Component} from 'react';
import Chat from './Chat.jsx';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Container from './Container.jsx';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class ReactAppRouter extends Component {

    render() {
        return (
            <MultiThemeProvider>
                <Router>
                    <div>
                        <Route path="/" component ={Container} />
                        <Route path="/login" component = {Login} />
                        <Route path="/register" component = {Register} />
                        <Route path="/chat" component = {Chat} />
                    </div>
                </Router>
            </MultiThemeProvider>
        );
    }
}

export default ReactAppRouter