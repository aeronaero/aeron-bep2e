import React, { Component } from 'react'
import CreateStake from './inc/CreateStake'
import RemoveStake from './inc/RemoveStake'
import WithdrawRewards from './inc/WithdrawRewards'

class Stake extends Component {
  
  render() {
    
    return (
      <div className="flex flex-wrap mx-5 my-5">
          
        <CreateStake
            tokenBalance={this.props.tokenBalance}
            createStake={this.props.createStake}
            minStake={this.props.minStake}
        />

        <WithdrawRewards
            rewardOf={this.props.rewardOf}
            withdrawReward={this.props.withdrawReward}
        />

        <RemoveStake
            stakeOf={this.props.stakeOf}
            removeStake={this.props.removeStake}
        />

      </div>
    )
  }
}

export default Stake;
