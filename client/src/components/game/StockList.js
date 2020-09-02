import React from 'react';
import './StockList.css';

export default class StockList extends React.Component {
	
	filterList(event) {
		var updatedList = this.props.stockList;
		updatedList = updatedList.filter(function(item){
      return item.stockName.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
	}
	
	constructor(props) {
		super(props);
		this.state = {
			items: []
		};
	}
    
    componentDidUpdate(prevProps, prevState) {
        if (this.props.stockList && prevState.items.length !== this.props.stockList.length) {
            this.setState({items: this.props.stockList});
        }
        if (prevProps.stockList && prevProps.selectedStockData) {
            const prevStockDetails = prevProps.stockList.filter(stk => stk.stockName === prevProps.selectedStockData.stockName)[0];
            const updatedStockDetails = this.props.stockList.filter(stk => stk.stockName === this.props.selectedStockData.stockName)[0];
            if (prevStockDetails && prevStockDetails.cmp !== updatedStockDetails.cmp) {
                this.setState({items: this.props.stockList});
            }
        }
    }
	
	render() {
        if (this.props.stockList) {
            var listLength = this.state.items.length;
            return(
                <div className="list-box">
                    <input
                        type="text" 
                        placeholder="Search" 
                        onChange={this.filterList.bind(this)}
                    />
                    <List items={this.state.items} stockSelected={this.props.stockSelected}/>
                </div>
            );
        } else {
            return (
                <div>No Stocks, Strange!!</div>
            )
        }
	}	
}

class List extends React.Component {
	render() {
    return (
      <ul>
      {this.props.items.map((item) => {
           return <li key={item.stockName} onClick={() => this.props.stockSelected(item)}>
           <img className='stockImage' src="../assets/images/bg_welcome.jpg" alt="img"/>   
           <span>{item.stockName}</span>
           <span className="phone">{item.cmp}</span>
         </li>  
			})}
      </ul>
    );  
  }
}