import React, { Component } from 'react'

class SetMinStake extends Component {
    //
    constructor(props) {
        super(props);
        this.state = {
            value: '',
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
            if(event.target.value <= 0) {
                this.setState({inputInvalid: true})
            }
            this.setState({value: event.target.value})
        }
    
        handleSubmit = (event) => {
            event.preventDefault()
            if(this.state.inputTouched && !this.state.inputInvalid) {
                let amount = Math.round(this.state.value.toString()*100000000)
                this.props.setMinStake(amount)    
                event.preventDefault();
            }
        }
    
      render() {
        
        
    
        return (
          <div className="w-full md:w-1/2 xl:w-1/3 py-3 px-3">
            <form className="p-12 rounded bg-aero-700" onSubmit={this.handleSubmit}>

        <h2 className="text-3xl uppercase font-bold">
          Minimum Stake
        </h2>

        <div className="mt-6 relative flex w-full flex-wrap items-stretch">
        <input 
                onChange={this.handleChange}
                value={this.state.value}
                min="0"
                placeholder="0"
                name="amount" autoComplete="off" type="number" required 
                className={`text-right outline-none text-5xl border-4 text-gray-800 rounded px-4 py-2 w-full 
                ${(this.state.inputTouched && this.state.inputInvalid) ? ' border-red-400' : ' border-transparent' }`} />
        </div>
        <div className="text-sm align-right mt-2 text-right">
            <span className="pr-2">
                Current: 
            </span>
            <span className="font-semibold">
                {this.props.minStake} ARN
            </span>
        </div>

        <button type="submit" className="mt-6 w-full px-8 text-3xl text-black hover:bg-yellow-500  rounded-lg bg-yellow-600 font-bold p-4 uppercase border-yellow-700 border">
            Set
        </button>

      </form>
      </div>
    );
  }
}

export default SetMinStake;
