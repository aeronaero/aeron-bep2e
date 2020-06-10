import React, { Component } from 'react'
import { formatNumber } from './Helpers'
import icon from '../../assets/icon.png'

class CreateStake extends Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
        tokenBalance: 0,
        inputTouched: false,
        inputInvalid: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

    handleChange = (event) => {
        this.setState({inputTouched: false})
        if(event.target.value) this.setState({inputTouched: true})
        this.setState({inputInvalid: false})
        if(event.target.value > this.props.tokenBalance || event.target.value < this.props.minStake) {
            this.setState({inputInvalid: true})
        }
        this.setState({value: event.target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if(this.state.inputTouched && !this.state.inputInvalid) {
            let amount = Math.round(this.state.value.toString()*100000000)
            this.props.createStake(amount)    
            event.preventDefault();
        }
    }

  render() {
    
    

    return (
      <div className="w-full md:w-1/2 xl:w-1/3 py-3 px-3">
        <form className="p-12 rounded bg-aero-700" onSubmit={this.handleSubmit}>
          <h2 className="text-3xl uppercase font-bold">
              Create Stake
          </h2>

          <div className="mt-6 relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug absolute text-center text-gray-400 absolute bg-transparent rounded items-center justify-center w-12 pl-3 mt-1 py-6">
                  <div className="absolute  left-0 pl-3 flex items-center ">
                      <img src={icon} alt="" className="w-12"/> 
                      <span className="text-3xl hidden font-thin text-gray-800 pl-2">ARN</span>
                  </div>
              </span>
              <input 
                onChange={this.handleChange}
                value={this.state.value}
                min={this.props.minStake}
                max={this.props.tokenBalance}
                placeholder="0"
                name="amount" autoComplete="off" type="number" required autoFocus
                className={`text-right outline-none text-5xl border-4 text-gray-800 rounded px-4 py-2 w-full 
                ${(this.state.inputTouched && this.state.inputInvalid) ? ' border-red-400' : ' border-transparent' }`} />
          </div>
          <div className="text-sm flex flex-wrap justify-between align-right mt-2 text-right">
              <div>
                <span className="pr-2">
                    Min: 
                </span>
                <span className="font-semibold pr-2">
                    {formatNumber(this.props.minStake)} ARN
                </span>
              </div>
              <div>
                <span className="pr-2">
                    Available: 
                </span>
                <span className="font-semibold">
                    {formatNumber(this.props.tokenBalance)} ARN
                </span>
              </div>
          </div>

          <button type="submit" className="mt-6 w-full px-8 text-3xl text-black hover:bg-yellow-500  rounded-lg bg-yellow-600 font-bold p-4 uppercase border-yellow-700 border">Stake</button>

        </form>
      </div>
    );
  }
}

export default CreateStake;
