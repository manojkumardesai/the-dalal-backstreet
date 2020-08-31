import React, { Component } from "react";
import './Dashboard.css';
import axios from "axios";

export default class Dashboard extends Component {

  state = {
    test: 'hello'
  }

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
      .then(({data}) => {
        this.setState({
          stockList: data.data
        });
      })
      .catch(error => {
        console.log("logout error", error);
      });
  }

  render() {
    return (
      <div className="container">
            <h1>The Dalal Street  </h1>
            <img src="" alt=""/>
            
            <div className="columns">
                <div className="col-1">
                  <ul>
                    {this.state.stockList && this.state.stockList.map(stock => {
                      return <li> {stock.stockName} </li>
                    })}
                  </ul>
                </div>
                <div className="col-2">
                    <h2>User Information / Stock Information</h2>
                    <p>Buy/Sell Logics</p>
                </div>
                <div className="col-1">
                    <p>Chat Room</p>
                </div>
            </div>
            
            <div className="columns">
                <div className="col-3">
                    <h2>List of Online People</h2>
                    <p></p>
                </div>
                <div className="col-1"><p>Current User Information</p></div>
            </div>
        </div>
    );
  }
}

// export default Dashboard;