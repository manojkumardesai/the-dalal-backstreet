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
			initialItems: [
				"Severian",
				"Thecla",
				"Dorcas",
				"Valeria",
				"Agia",
				"Jonas",
				"Jolenta",
				"Baldanders",
				"Talos",
				"Burgundofara",
				"Ouen",
				"Tzadkiel",
				"Apu Punchau",
				"Vodalus",
				"Typhon"
			],
			items: []
		};
	}
	
	componentWillMount() {
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (this.props.stockList && prevState.items.length !== this.props.stockList.length) {
            this.setState({items: this.props.stockList});
        }
    }
	
	render() {
        if (this.props.stockList) {
            var listLength = this.state.items.length;
            return(
                <div className="list-box">
                    <h2 className="count">{listLength}
                        {listLength > 1 || listLength === 0 ?
                        " results" : 
                        " result"}
                    </h2>
                    <input
                        type="text" 
                        placeholder="Search" 
                        onChange={this.filterList.bind(this)}
                    />
                    <List items={this.state.items} />
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
      {this.props.items.map(function(item) {
           return <li>
           <img className='stockImage' src="../assets/images/bg_welcome.jpg" alt="img"/>   
           <span>{item.stockName}</span>
           <span className="phone">{item.stockSymbol}</span>
         </li>  
			})}
      </ul>
    );  
  }
}