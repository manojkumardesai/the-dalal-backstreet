import React, { Component } from "react";
import './Dashboard.css';
import axios from "axios";
import Join from './join/Join';
import Chat from './chat/Chat';
import StockList from './game/StockList';
import StockDetail from './interactionCard/StockDetail';

export default class Dashboard extends Component {

  state = {
    test: 'hello',
    chatView: false,
    location: {},
    interactionView: 'default',
    selectedStock: {}
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
  fetchStocks = () => {
    if (this.props.token) {
      axios
        .get("/api/list/", {
          headers: {
            Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
          }
         })
        .then(({data}) => {
          this.setState({
            stockList: data.data
          });
          this.fetchUsersStocks();
        })
        .catch(error => {
          console.log("logout error", error);
        });
    }
  }
  fetchUsersStocks = () => {
    if (this.props.token) {
      axios
        .get("/api/item/", {
          headers: {
            Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
          }
         })
        .then(({data}) => {
          this.setState({
            userStocks: data.data
          });
        })
        .catch(error => {
          console.log("logout error", error);
        });
    }
  }

  stockSelected = (stock) => {
    this.setState({
      interactionView: 'stock',
      selectedStock: stock
    });
  }

  toggleView = () => {
    this.setState({
      chatView: false
    });
  }
  toggleUserView = () => {
    this.setState({
      interactionView: 'user'
    });
  }

  updateStockPrice = (stockId, userTransaction) => {
    const {stockSymbol, stockName, cmp, qtyAvailable, stockImage} = this.state.selectedStock;
    const updatedQty = qtyAvailable - userTransaction.qty;
    const updatedPrice =  (1 + (userTransaction.qty/qtyAvailable)) * cmp;
    const payLoad = {
      stockSymbol,
      stockName,
      cmp: updatedPrice,
      qtyAvailable: updatedQty,
      stockImage
    };
    axios
    .put(`/api/list/${stockId}`, payLoad, {
      headers: {
        Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
      }
     })
    .then(({data}) => {
      this.fetchStocks();
      this.updateUserBalance(userTransaction, 'buy');
      this.setState({
        interactionView: 'notify'
      })
      setTimeout(() => {
        this.setState({
          interactionView: 'default'
        })
      }, 3000);
    })
    .catch(error => {
      console.log("logout error", error);
    });
  }

  updateUserBalance = (userDetails, transactionType) => {
    const payLoad = this.props.user;
    if (transactionType === 'buy') {
      payLoad.worth =  payLoad.worth - (userDetails.qty * userDetails.avgPrice);
    } else {
      payLoad.worth =  payLoad.worth + (userDetails.qty * userDetails.avgPrice);
    }
    axios
    .put(`/api/user/`, payLoad, {
      headers: {
        Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
      }
     })
    .then(({data}) => {
      this.props.updateUser();
    })
    .catch(error => {
      console.log("logout error", error);
    });
  }
  updateSellStockPrice = (stockId, userTransaction) => {
    const {stockSymbol, stockName, cmp, qtyAvailable, stockImage} = this.state.selectedStock;
    const updatedQty = qtyAvailable + userTransaction.qty;
    const updatedPrice =  (1-(userTransaction.qty/qtyAvailable)) * cmp;
    const payLoad = {
      stockSymbol,
      stockName,
      cmp: updatedPrice,
      qtyAvailable: updatedQty,
      stockImage
    };
    axios
    .put(`/api/list/${stockId}`, payLoad, {
      headers: {
        Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
      }
     })
    .then(({data}) => {
      this.fetchStocks();
      this.setState({
        interactionView: 'notify'
      })
      setTimeout(() => {
        this.setState({
          interactionView: 'default'
        })
      }, 3000);
    })
    .catch(error => {
      console.log("logout error", error);
    });
  }

  handleBuyTransaction = (payLoad) => {
    axios
      .put("/api/item/" + payLoad.list, payLoad, {
        headers: {
          Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
        }
        })
      .then(({data}) => {
        this.updateStockPrice(payLoad.list, payLoad);
      })
      .catch(error => {
        console.log("logout error", error);
      });
  }
  handleSellTransaction = (payLoad) => {
    axios
      .put("/api/item/" + payLoad.list, payLoad, {
        headers: {
          Authorization: 'Bearer ' + this.props.token //the token is a variable which holds the token
        }
        })
      .then(({data}) => {
        this.updateSellStockPrice(payLoad.list, payLoad);
      })
      .catch(error => {
        console.log("logout error", error);
      });
  }

  render = () => {
    return (
      <div className="container">            
            <div className="columns">
                <div className="col-1">
                  <StockList 
                    stockList={this.state.stockList} 
                    stockSelected={this.stockSelected}
                    selectedStockData={this.state.selectedStock}/>
                </div>
                <div className="col-2 interactionBoard">
                    {this.state.interactionView === 'stock' ?
                     <StockDetail stock={this.state.selectedStock} user={this.props.user} 
                      userStocks = {this.state.userStocks}
                      initiateBuy = {this.handleBuyTransaction}
                      initiateSell = {this.handleSellTransaction}
                    /> : null
                    }
                    {this.state.interactionView === 'notify' ?
                     <div> Transaction Successfull </div>
                    : null
                    }
                    {
                      this.state.interactionView === 'default' ?
                      <div>
                        <h3>Welcome to</h3>
                        <h1>The Dalal Street</h1>
                      </div>
                      : null
                    }
                    {
                      this.state.interactionView === 'user' ?
                      <div>
                        {this.state.userStocks.map(data => (
                          <h3>{data.qty} {data.stockName} stock worth {data.avgPrice}$</h3>
                        ))}
                      </div> : null
                    }
                </div>
                <div className="col-1">
                    { this.state.chatView ? <Chat location={this.state.location} onExit={this.toggleView} /> :
                      <Join handleClick={this.intiateChatSession}/>
                    }
                </div>
            </div>
            
            <div className="columns">
                <div className="col-3">
                    <h2>Currently Playing</h2>
                    <p>Coming Soon</p>
                </div>
                <div className="col-1 userInfo" onClick = {this.toggleUserView}>
                  <h3>
                    Account Information
                  </h3>
                  <span>Available Balance: {this.props.user.worth} $</span>
                  <h4>
                    {this.props.user.firstName}
                  </h4>
                </div>
            </div>
        </div>
    );
  }
}

// export default Dashboard;