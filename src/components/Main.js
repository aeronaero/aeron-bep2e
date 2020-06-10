import React, { Component } from 'react'
import Stake from './Stake'
import Migrate from './Migrate'
import Admin from './Admin'
import Faucet from './Faucet'
import Error from './inc/Error'
import Stat from './inc/Stat'
import Identicon from 'identicon.js';
import AeronLogo from '../assets/logo.svg'

class Main extends Component {

  render() {
    let content, stats, error, status

    let menu = this.props.routes.map(route => {
      return (
      <li key={route.id}
        className={`cursor-pointer uppercase block mx-6 py-4 px-0 hover:text-white hover:border-white border-b-4 
        ${this.props.currentScreen === route.id ? 'border-white text-white' : 'text-blue-100 border-transparent'}`}
        onClick={(event) => {
          this.props.setScreen(route.id)
        }}
        >
       {route.title}
     </li>
     )
    })
 

    if(this.props.currentScreen === 'admin') {
        stats = this.props.adminStats.map(stat => {
            return (
                <Stat key={stat.id} stat={stat}/>
            )
        })
      content = <Admin
        setMinStake={this.props.setMinStake}
        minStake={this.props.minStake}
        blocksPerReward={this.props.blocksPerReward}
        setBlocksPerReward={this.props.setBlocksPerReward}
        rewardPercent={this.props.rewardPercent}
        setRewardPercent={this.props.setRewardPercent}
        stakingContractAddress={this.props.stakingContractAddress}
        rewardTiers={this.props.rewardTiers}
        setRewardTier={this.props.setRewardTier}
        removeRewardTier={this.props.removeRewardTier}
        setStakingContract={this.props.setStakingContract}
        
      />
    }  else if(this.props.currentScreen === 'stake') {
        stats = this.props.stats.map(stat => {
            return (
                <Stat key={stat.id} stat={stat}/>
            )
        })
      content = <Stake
        createStake={this.props.createStake}
        removeStake={this.props.removeStake}
        withdrawReward={this.props.withdrawReward}
        tokenBalance={this.props.tokenBalance}
        stakeOf={this.props.stakeOf}
        rewardOf={this.props.rewardOf}
        minStake={this.props.minStake}
      /> 
    }  else if(this.props.currentScreen === 'migrate') {
      content = <Migrate/>
    }
    else if(this.props.currentScreen === 'faucet') {
        content = <Faucet
        faucet={this.props.faucet}
        />
    }

    if(this.props.error.message) {
        error = <Error error={this.props.error.message}/> 
    }

    if(this.props.isWaiting) {
        status = <div className="flex flex-wrap mx-6 my-5">
        <div className="bg-green-700 border-l-4 w-full border-green-100 p-5" role="alert">
            <p className="font-bold">Status</p>
            <p className="break-all" id="loader">Waiting for transaction to complete...</p>
        </div>
        </div> 
    }

    return (
    <div>
        <div className="bg-aero-900 p-5">  
            <nav className="flex items-center justify-between flex-wrap mb-6">
                <div className="flex items-center flex-shrink-0 text-white mx-auto sm:mx-4 mb-4 sm:mb-0">
                    <img className="fill-current w-40" alt="" src={ AeronLogo }/>
                </div>
                <div className="block mx-auto flex items-center w-auto mb-4 sm:mb-0">
                    <ul className="text-xl align-items-center flex flex-grow-1 flex-wrap justify-items-center">
                    { menu }
                    </ul>
                </div>
                <div className="flex flex-shrink-0 mx-auto lg:mx-4">
                    <div className="text-sm px-4 py-2 leading-none border rounded hover:text-white hover:border-white text-blue-100 border-blue-100">
                        <span className="text-xs">Connected account: 
                        <span className="pl-2 font-bold text-red-600">{ this.props.isAdmin }</span>
                        </span><br/>
                        <span className="text-xs truncate block sm:inline">{this.props.account}</span>
                        { this.props.account
                        ? <img className="w-6 w-6 inline ml-2" alt=""
                            src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                        />
                        : <span></span>
                        }
                    </div>
                </div>
            </nav>
            <div className="flex flex-wrap mt-3">
                { stats }
            </div>
        </div>

        { status }
        { error }
        
        { content }        
        
    </div>

    )
  }
}

export default Main;
