import React, { Component } from 'react'

class SetStakingAddress extends Component {
    //
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
        handleChange = (event) => {
          this.setState({value: event.target.value})
        }
    
        handleSubmit = (event) => {
            event.preventDefault()
            let address = this.state.value
            this.props.setStakingContract(address)    
        
        }
    
      render() {
        
        
    
        return (
          <div className="w-full md:w-1/2 xl:w-1/3 py-3 px-3">
            <form className="p-12 rounded bg-red-900" onSubmit={this.handleSubmit}>

        <h2 className="text-3xl uppercase font-bold">
          Staking Contract
        </h2>

        <div className="mt-6 relative flex w-full flex-wrap items-stretch">
        <input 
          onChange={this.handleChange}
          value={this.state.value}
          placeholder=""
          autoComplete="off" type="text" required pattern="^(0x){1}[0-9a-fA-F]{40}$" minLength="42"
          className="text-right outline-none text-5xl border-4 text-gray-800 rounded px-4 py-2 w-full border-transparent"
        />
        </div>
        <div className="text-sm align-right mt-2 text-right">
            <span className="pr-2">
                Current: 
            </span>
            <span className="font-semibold text-xs">
                {this.props.stakingContractAddress}
            </span>
        </div>

        <button type="submit" className="mt-6 w-full px-8 text-3xl text-black hover:bg-yellow-500 rounded-lg bg-yellow-600 font-bold p-4 uppercase border-yellow-700 border">
            Set
        </button>

      </form>
      </div>
    );
  }
}

export default SetStakingAddress;
