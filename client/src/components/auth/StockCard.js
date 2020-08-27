import React from "react";

const StockCard = props => {
  return (
    <div>
      <div>
        <h1>{props.stockName}</h1>
        <h3>{props.stockSymbol}</h3>
        <h4>{props.stockSymbol}</h4>
        <h4>{props.stockSymbol}</h4>
      </div>
    </div>
  );
};

export default StockCard;