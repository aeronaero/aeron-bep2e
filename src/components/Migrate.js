import React, { Component } from 'react'

class Migrate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0'
    }
  }

  render() {
    return (
      <div className="bg-aero-800 h-screen p-5 text-center"> 
      <div className="w-full md:w-1/2 py-3 px-3 mx-auto p-12 rounded bg-aero-700">
    
        <h1 className="text-6xl font-bold mb-5">Migration</h1>
        
        <h3 className="text-xl font-bold mb-5">
          Migration guide to be released soon.
        </h3>

        <h3 className="text-xl font-bold mb-5">
          <a rel="noopener noreferrer nofollow" target="_blank" 
          className="ml-2 underline hover:text-yellow-100" href="https://www.binance.org/en/smartChain">
            Learn more about Binance Smart Chain
          </a>
          </h3>

          <h3 className="text-xl font-bold mb-5">
          <a rel="noopener noreferrer nofollow" target="_blank" className="ml-2 underline hover:text-yellow-100" 
          href="https://github.com/binance-chain/docs-site/blob/add-bsc/docs/smart-chain/wallet/metamask.md">
            Use Metamask For Binance Smart Chain
          </a>
          </h3>

          
        
        
        
        
        </div>
      </div>
    )
  }
}

export default Migrate;
