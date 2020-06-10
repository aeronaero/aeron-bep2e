import React, { Component } from 'react'
import icon from '../../assets/icon.png'
import { formatNumber } from './Helpers'

class WithdrawRewards extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    if(this.props.rewardOf > 0) this.props.withdrawReward()
  }

  render() {
    return (
      <div className="w-full md:w-1/2 xl:w-1/3 py-3 px-3">
      <form className="p-12 rounded bg-aero-700" onSubmit={this.handleSubmit}>

        <h2 className="text-3xl uppercase font-bold">
          Withdraw <span className="inline md:hidden lg:inline">Rewards</span>
        </h2>
        <div className="mt-6 relative flex w-full flex-wrap items-stretch">
            <span className="z-10 h-full leading-snug absolute text-center text-gray-400 absolute bg-transparent rounded items-center justify-center w-12 pl-3 mt-1 py-6">
                <div className="absolute  left-0 pl-3 flex items-center ">
                    <img src={icon} alt="" className="w-12"/> 
                    <span className="text-3xl hidden font-thin text-gray-800 pl-2">ARN</span>
                </div>
            </span>
            <input onChange={this.handleChange}  
            value={this.props.rewardOf}
            disabled autoComplete="off" type="number" 
            className="pl-10 bg-gray-400 text-right border-4 border-gray-400 text-5xl text-gray-600 rounded px-4 py-2 w-full" />
        </div>


        <div className="text-sm align-right mt-2 text-right">
            <span className="pr-2">
                Available: 
            </span>
            <span className="font-semibold">
                {formatNumber(this.props.rewardOf)} ARN
            </span>
        </div>

        <button type="submit" className="mt-6 w-full px-8 text-3xl text-black hover:bg-yellow-500  rounded-lg bg-yellow-600 font-bold p-4 uppercase border-yellow-700 border">
            Withdraw
        </button>

      </form>
      </div>
    );
  }
}

export default WithdrawRewards;
