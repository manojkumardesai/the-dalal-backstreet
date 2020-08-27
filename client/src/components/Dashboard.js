import React, { Component } from "react";
import axios from "axios";

export default class Dashboard extends Component {

  componentDidMount() {
    this.fetchStocks();
  }

  fetchStocks() {
    axios
      .get("http://localhost:3001/api/list/", {
        headers: {
          Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
        }
       })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log("logout error", error);
      });
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <h1>Status: {this.props.loggedInStatus}</h1>
      </div>
    );
  }
}

// export default Dashboard;