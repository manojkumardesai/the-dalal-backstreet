import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Chat from "./components/chat/Chat";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {},
      token: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  checkLoginStatus() {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios
      .get("/api/user/", {
        headers: {
          Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
      })
      .then(response => {
        if (response.data) {
          response.data.token = token;
          this.handleLogin(response.data);
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
    }
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  handleLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    });
    sessionStorage.removeItem('token');
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data.data,
      token: data.token
    });
    sessionStorage.setItem('token', data.token);
  }

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={"/"}
              render={props => (
                <Home
                  {...props}
                  handleLogin={this.handleLogin}
                  handleLogout={this.handleLogout}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />
            <Route
              exact
              path={"/dashboard"}
              render={props => (
                <Dashboard
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  user={this.state.user}
                  token={this.state.token}
                  updateUser={this.checkLoginStatus}
                />
              )}
            />
            <Route 
              path="/chat"
              component={Chat}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}