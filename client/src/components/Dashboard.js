import React, { Component } from "react";
import './Dashboard.css';
import axios from "axios";
import Join from './join/Join';
import Chat from './chat/Chat';
import StockList from './game/StockList';

export default class Dashboard extends Component {

  state = {
    test: 'hello',
    chatView: false,
    location: {}
  }

  componentDidMount() {
    this.fetchStocks();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.token !== this.props.token) {
      this.fetchStocks();
    }
  }
  intiateChatSession = (name, room) => {
    if (name && room) {
      this.setState({
        chatView: true,
        location: {
          name, room
        }
      })
    } else {
      return;
    }
  }
  fetchStocks() {
    if (this.props.token) {
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
  }
  toggleView = () => {
    this.setState({
      chatView: false
    });
  }

  render() {
    return (
      <div className="container">
            <h1>The Dalal Street</h1>
            
            <div className="columns">
                <div className="col-1">
                  <StockList stockList={this.state.stockList} />
                  {/* <ul>
                    {this.state.stockList && this.state.stockList.map(stock => {
                      return <li key={stock.stockSymbol}> {stock.stockName} </li>
                    })}
                  </ul> */}
                </div>
                <div className="col-2">
                    <h2>User Information / Stock Information</h2>
                    <p>Buy/Sell Logics</p>
                </div>
                <div className="col-1">
                    { this.state.chatView ? <Chat location={this.state.location} onExit={this.toggleView} /> :
                      <Join handleClick={this.intiateChatSession}/>
                    }
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