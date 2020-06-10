import React, { Component } from 'react'
import { formatNumber } from './Helpers'

class SetRewardTier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            percent: '',
        };
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handlePercentChange = this.handlePercentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleAmountChange = (event) => {
        this.setState({amount: event.target.value})
    }

    handlePercentChange = (event) => {
        this.setState({percent: event.target.value})
    }
    
    handleSubmit = (event) => {
        event.preventDefault()
        
        let amount = Math.round(this.state.amount.toString()*100000000)
        let percent = Math.round(this.state.percent.toString()*100000/100)
        this.props.setRewardTier(amount, percent)    
        event.preventDefault();
    }

    render() {
    
    let tiers = this.props.rewardTiers.map( tier => {
        return (
            <div key={tier.amount} className="text-sm align-right mt-2 text-right">
                <span className="font-semibold">
                > {formatNumber(tier.amount)} ARN 
                </span>
            </div>
        )
    })

    let percents = this.props.rewardTiers.map( tier => {
        return (
            <div  key={tier.percent} className="text-sm align-left mt-2 text-left">
                <span className="font-semibold">
                    = {formatNumber(tier.percent)}%
                </span>
            </div> 
        )
    })

    return (
        <div className="w-full md:w-full xl:w-2/3 py-3 px-3">
        <form className="p-12 rounded bg-aero-700" onSubmit={this.handleSubmit}>

    <h2 className="text-3xl uppercase font-bold">
        Reward Tiers
    </h2>

    <div className="mt-4 relative flex w-full flex-wrap">
        <div className="w-1/2  pr-4">
            <div className="text-sm align-left mb-2 text-left">
                <span className="">
                    Tier amount, ARN 
                </span>
            </div>
            <input 
                onChange={this.handleAmountChange}
                value={this.state.amount}
                min="0"
                placeholder="0"
                name="amount" autoComplete="off" type="number" required 
                className="border-transparent text-right outline-none text-5xl border-4 text-gray-800 rounded-lg px-4 py-2 w-full"
                 />
            
            {tiers}
        </div>
        <div className="w-1/2 pl-4">
        <div className="text-sm align-left mb-2 text-left">
                <span className="">
                    Reward percent 
                </span>
                </div>
        <input 
            onChange={this.handlePercentChange}
            value={this.state.percent}
            min="0"
            step="0.001"
            placeholder="0"
            name="amount" autoComplete="off" type="number" required 
            className="border-transparent text-right outline-none text-5xl border-4 text-gray-800 rounded-lg px-4 py-2 w-full"
             />
                
            {percents}
        </div>
    </div>
    

    <button type="submit" className="mt-8 w-full px-6 text-3xl text-black hover:bg-yellow-500  rounded bg-yellow-600 font-bold p-4 uppercase border-yellow-700 border">
        Set
    </button>

    </form>
    </div>
);
}
}

export default SetRewardTier;
