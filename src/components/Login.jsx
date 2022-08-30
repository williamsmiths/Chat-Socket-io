import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';



class Login extends React.Component {

    constructor(props){
        super();

        this.state = {
            username: '',
            password: '',
            loginURL: '/api/auth',
            errorState: false,
            router : props.router
        }

    }

    onChangeUsername = (event) => {
        this.setState({username : event.target.value});
    };

    onChangePassword = (event) => {
        this.setState({password : event.target.value});
    };


    //make api auth call and store resulting web token if successful
    onSubmit = (e) => {
        e.preventDefault();
        this.signIn();
    };

    signIn = () => fetch(this.state.loginURL,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username : this.state.username,
                password : this.state.password,
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.error){
                this.setState({errorState: true});
                return;
            }
            //if successful assign user and token
            window.localStorage.setItem('ChatToken', responseJson.token);

            //navigate to chat page
            this.props.history.push({
                pathname: '/chat',
                state : {
                    user: responseJson.user
                }
            });
        });



    render() {
        return (
            <div>
                <p>Login component</p>
                <form onSubmit={this.onSubmit}>
                    <TextField
                        hintText="Username"
                        value={this.state.username}
                        label="Username"
                        onChange={this.onChangeUsername}
                        errorText={this.state.errorState && 'Error logging in'}
                        />
                    <TextField
                        type="password"
                        hintText="Password"
                        label="Login"
                        onChange={this.onChangePassword}
                        />
                   <RaisedButton
                        type="submit"
                        label="logon"
                   />

                </form>
                <p> if you aren't a member then<Link to="/register"> Register an account </Link></p>
            </div>
        );
    }
}

export default withRouter(Login);