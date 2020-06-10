import React, { Component } from 'react'

class Error extends Component {

  render() {
    if(this.props.error === 'noMetaMask')
    {
      this.props.error = <span>
        You need to install Metamask and connect to Binance Smart Chain.
        <a className="ml-2 hover:text-yellow-200 font-semibold" href="https://github.com/binance-chain/docs-site/blob/add-bsc/docs/smart-chain/wallet/metamask.md">
          View guide.
      </a></span>;
    }
    return (
        <div className="flex flex-wrap mx-6 my-5">
            <div className="bg-red-900 border-l-4 w-full border-red-400 p-5" role="alert">
                <p className="font-bold">Error</p>
                <p className="break-all">{this.props.error}</p>
            </div>
        </div> 
  )
  }
}

export default Error;
