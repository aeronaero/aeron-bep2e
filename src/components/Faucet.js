import React, { Component } from 'react'

class Faucet extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
}
  handleSubmit(event) {
    event.preventDefault()
    this.props.faucet()
  }

  render() {
    return (
      <div className="bg-aero-800 h-screen p-5 text-center"> 
      <div className="w-full md:w-1/2 py-3 px-3 mx-auto">
      <form className="p-12 rounded bg-aero-700" onSubmit={this.handleSubmit}>
        <h1 className="text-6xl font-bold mb-5">Testnet ARN Faucet</h1>
        <h3 className="text-xl font-bold mb-5"> First you will need to get testnet BNB tokens:

        <a rel="noopener noreferrer nofollow" target="_blank"
        className="ml-2 underline hover:text-yellow-100" 
         href="https://testnet.binance.org/faucet-smart">
        BNB testnet faucet
        </a>.<br/><br/> To claim ARN test tokens click below:
        </h3>
        <button type="submit" className="mt-8 w-1/2 px-6 text-3xl text-black hover:bg-yellow-500  rounded bg-yellow-600 font-bold p-4 uppercase border-yellow-700 border">
          Claim Now!
        </button>
        </form>
        </div>
      </div>
    )
  }
}

export default Faucet;
