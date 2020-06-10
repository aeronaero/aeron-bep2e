import React, { Component } from 'react'
import { formatNumber } from './Helpers'

class SetRewardTier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (event) => {
        this.setState({value: event.target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if(this.state.value){
            let amount = Math.round(this.state.value.toString()*100000000)
            this.props.removeRewardTier(amount)
        }
    }
    render() {

        let options = this.props.rewardTiers.map(tier => {
            return (
                <option key={tier.amount} className="text-right" value={tier.amount}>
                ({ formatNumber(tier.percent) }%) { formatNumber(tier.amount) }
                </option>
            )
        })

        return (
        <div className="w-full md:w-1/2 xl:w-1/3 py-3 px-3 flex justify-between">
            <form className="p-12 w-full rounded bg-aero-700 flex flex-col justify-between" onSubmit={this.handleSubmit}>
                
                <h2 className="text-3xl uppercase  font-bold">
                    Remove Tier
                </h2>
                <div className="mt-4 w-full relative">
                <div className="relative">
                     <select onChange={this.handleChange}
                        value={this.state.value}
                        className="border-4 border-transparent block text-5xl appearance-none w-full bg-gray-200  text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        required dir="rtl">
                        <option className="text-right"></option>
                        { options }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                
       
                    <div className="text-sm align-right mt-2 text-right">
                        <span className="pr-2">
                        Select tiers amount to remove
                        </span>
                    </div>
                </div>
                <button type="submit" className="mt-6 w-full px-8 text-3xl text-black hover:bg-yellow-500  rounded-lg bg-yellow-600 font-bold p-4 uppercase border-yellow-700 border">
                    Remove
                </button>

            </form>
        </div>
        );
    }
}

export default SetRewardTier;
