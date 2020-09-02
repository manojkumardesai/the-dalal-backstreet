import React from 'react';

export default class StockDetail extends React.Component {
    render = () => {
        const {stock, user} = this.props;
        return (
        <div>
            <h2>
                {stock.stockName}
            </h2>
        <h4>Available Qty: {stock.qtyAvailable}</h4>
        <h4>Current Price: {stock.cmp}</h4>
        <input placeholder="Enter quantity to trade"></input>
        <h3>{user.firstName}</h3>
        <button>Buy</button>
        <button>Sell</button>
        </div>
        )
    }
}