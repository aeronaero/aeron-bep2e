import React, { Component } from 'react'
import RemoveRewardTier from './inc/RemoveRewardTier'
import SetBlocksPerReward from './inc/SetBlocksPerReward'
import SetMinStake from './inc/SetMinStake'
import SetRewardPercent from './inc/SetRewardPercent'
import SetStakingContract from './inc/SetStakingContract'
import SetRewardTier from './inc/SetRewardTier'

class Admin extends Component {

  render() {
    
    return (
      <div className="flex flex-wrap mx-5 my-5">
          
        <SetMinStake
          minStake={this.props.minStake}
          setMinStake={this.props.setMinStake}
        />

        <SetBlocksPerReward
          blocksPerReward={this.props.blocksPerReward}
          setBlocksPerReward={this.props.setBlocksPerReward}
        />

       <SetRewardPercent
          rewardPercent={this.props.rewardPercent}
          setRewardPercent={this.props.setRewardPercent}
        />

        <SetRewardTier
          setRewardTier={this.props.setRewardTier}
          rewardTiers={this.props.rewardTiers}
        />

        <RemoveRewardTier
          rewardTiers={this.props.rewardTiers}
          removeRewardTier={this.props.removeRewardTier}
        />

        <SetStakingContract
          stakingContractAddress={this.props.stakingContractAddress}
          setStakingContract={this.props.setStakingContract}
        />

      </div>
    )
  }
}

export default Admin;
