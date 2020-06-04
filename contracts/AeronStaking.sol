// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.7;

import "./AeronToken.sol";

contract AeronStaking is Ownable {
    using SafeMath for uint256;

    address[] internal stakeholders;
    /**
     * @dev The stakes and starting block for each stakeholder.
     * Storing format address => staking amount
     */
    mapping (address => uint256) internal stakes;

    /**
     * @dev The stakes and starting block for each stakeholder.
     * Storing format address => starting block
     */
    mapping (address => uint256) internal blocks;

    /**
     * @dev The reward tier system.
     * staking amount => reward percent multiplied by 1000
     */
    //mapping (uint256 => uint16)[] internal rewards;
    uint256[] private tierAmounts;
    uint16[] private tierPercent;

    /**
     * @notice Default reward percent multiplied by 1000.
     */
    uint16 private _rewardPercent;

    /**
     * @dev Staking lock time in block per one reward.
     * 17280 is 24h
     */
    uint256 private _blocksPerReward;

    /**
     * @dev AeronToken contract address.
     */
    AeronToken internal _token;

    constructor(AeronToken token) public {
        setRewardPercent(1000);
        setRewardTier(100000000, 1000);
        setRewardTier(100000000000, 1000);
        set_blocksPerReward(17280);
        setToken(token);
    }

    function setToken(AeronToken token) internal virtual {
        _token = token;
    }

    function exportStakeholders() public view returns(address[] memory) {
        return stakeholders;
    }

    /**
     * @dev A method for a stakeholder to create a stake.
     * @param _stake The size of the stake to be created.
     */
    function createStake(uint256 _stake) public {
        _token.burn(msg.sender, _stake);
        if(stakes[msg.sender] == 0) addStakeholder(msg.sender);
        withdrawReward();
        blocks[msg.sender] = block.number;
        stakes[msg.sender] = stakes[msg.sender].add(_stake);
    }

    /**
     * @dev A method for a stakeholder to remove a stake.
     * @param _stake The size of the stake to be removed.
     */
    function removeStake(uint256 _stake) public {
        if(stakes[msg.sender] < _stake) return;
        withdrawReward();
        blocks[msg.sender] = block.number;
        stakes[msg.sender] = stakes[msg.sender].sub(_stake);
        if(stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _token.mint(msg.sender, _stake);
    }

    /**
     * @dev A method to retrieve the stake for a stakeholder.
     * @param _stakeholder The stakeholder to retrieve the stake for.
     * @return uint256 The amount staked.
     */
    function stakeOf(address _stakeholder) public view returns(uint256) {
        return stakes[_stakeholder];
    }

    /**
     * @dev A method to retrieve the start block for a stakeholder.
     * @param _stakeholder The stakeholder to retrieve the stake for.
     * @return uint256 The block number of stakeholder.
     */
    function blockOf(address _stakeholder) public view returns(uint256) {
        return blocks[_stakeholder];
    }

    /**
     * @dev A method to the aggregated stakes from all stakeholders.
     * @return uint256 The aggregated stakes from all stakeholders.
     */
    function totalStakes() public view returns(uint256) {
        uint256 _totalStakes = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            _totalStakes = _totalStakes.add(stakes[stakeholders[s]]);
        }
        return _totalStakes;
    }

    /**
     * @dev A method to check if an address is a stakeholder.
     * @param _address The address to verify.
     * @return bool, uint256 Whether the address is a stakeholder,
     * and if so its position in the stakeholders array.
     */
    function isStakeholder(address _address) public view returns(bool, uint256) {
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    /**
     * @dev A method to add a stakeholder.
     * @param _stakeholder The stakeholder to add.
     */
    function addStakeholder(address _stakeholder) internal {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }

    /**
     * @dev A method to remove a stakeholder.
     * @param _stakeholder The stakeholder to remove.
     */
    function removeStakeholder(address _stakeholder) internal {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if(_isStakeholder) {
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    /**
     * @dev A method to allow a stakeholder to check his rewards.
     * @param _stakeholder The stakeholder to check rewards for.
     */
    function rewardOf(address _stakeholder) public view returns(uint256) {
        if(blocks[_stakeholder] == 0 || stakes[_stakeholder] == 0) return 0;
        uint256 numberOfRewards = block.number.sub(blocks[_stakeholder]).div(_blocksPerReward);
        uint256 rewardPercent = _rewardPercent;
        uint256 prev_high = 0;
        for (uint256 s = 0; s < tierAmounts.length; s += 1) {
            if (stakes[_stakeholder] > tierAmounts[s] && tierAmounts[s] > prev_high) {
                rewardPercent = tierPercent[s];
                prev_high = tierPercent[s];
            }
        }
        return stakes[_stakeholder].mul(numberOfRewards).mul(rewardPercent).div(100000);
    }

    /**
     * @dev A method to the aggregated rewards from all stakeholders.
     * @return uint256 The aggregated rewards from all stakeholders.
     */
    function totalRewards() public view returns(uint256) {
        uint256 _totalRewards = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            _totalRewards = _totalRewards.add(rewardOf(stakeholders[s]));
        }
        return _totalRewards;
    }

    /**
     * @dev A method to allow a stakeholder to withdraw his rewards.
     */
    function withdrawReward() public {
        uint256 reward = rewardOf(msg.sender);
        if(reward > 0) {
            blocks[msg.sender] = block.number;
            _token.mint(msg.sender, reward);
        }
    }

    /**
     * @dev A method to allow owner to set default reward percent (multiplied by 1000).
     */
    function setRewardPercent(uint16 rewardPercent_) public onlyOwner {
        _rewardPercent = rewardPercent_;
    }

    /**
     * @dev A method to check if an amount is a RewardTier amount.
     * @return bool, uint256 Whether the rewardAmount_ is a RewardTier,
     * and if so its position in the RewardTier array.
     */
    function isRewardTier(uint256 rewardAmount_) public view returns(bool, uint256) {
        for (uint256 s = 0; s < tierAmounts.length; s += 1) {
            if (rewardAmount_ == tierAmounts[s]) return (true, s);
        }
        return (false, 0);
    }

    /**
     * @dev A method to allow owner to set reward tier.
     */
    function setRewardTier(uint256 rewardAmount_, uint16 rewardPercent_) public onlyOwner {
        require(rewardAmount_ > 0, 'rewardAmount_ is not valid');
        require(rewardPercent_ > 0, 'rewardPercent_ is not valid');
        tierAmounts.push(rewardAmount_);
        tierPercent.push(rewardPercent_);
    }

    /**
     * @dev A method to allow owner to remove reward tier.
     */
    function removeRewardTier(uint256 rewardAmount_) public onlyOwner {
        require(rewardAmount_ > 0, 'rewardAmount_ is not valid');
        require(tierAmounts[rewardAmount_] > 0, 'rewardPercent_ is not valid');
        (bool _isRewardAmount, uint256 s) = isRewardTier(rewardAmount_);
        if(_isRewardAmount) {
            tierAmounts[s] = tierAmounts[tierAmounts.length - 1];
            tierPercent[s] = tierPercent[tierPercent.length - 1];
            tierAmounts.pop();
            tierPercent.pop();
        }
    }

    /**
     * @dev A method to display reward percent multiplied by 1000.
     */
    function rewardPercent() public view returns (uint16) {
        return _rewardPercent;
    }

    /**
     * @dev A method to allow owner to set lock time for staking.
     */
    function set_blocksPerReward(uint256 blocksPerReward_) public onlyOwner {
        _blocksPerReward = blocksPerReward_;
    }

    /**
     * @dev A method to display staking lock time in blocks.
     */
    function blocksPerReward() public view returns (uint256) {
        return _blocksPerReward;
    }

    /**
     * @dev A method to display staking lock time in blocks.
     */
    function blocksTillReward(address _stakeholder) public view returns(uint256) {
        return _blocksPerReward.sub(block.number.sub(blocks[_stakeholder]).mod(_blocksPerReward));
    }
}
