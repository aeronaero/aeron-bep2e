pragma solidity ^0.6.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AeronToken is ERC20, Ownable {
    using SafeMath for uint256;

    address[] internal stakeholders;

    /**
     * @notice The stakes for each stakeholder.
     */
    mapping(address => uint256) internal stakes;

    /**
     * @notice The lock block for each stakeholder.
     */
    mapping(address => uint256) internal startBlocks;

    /**
     * @notice Reward percent multiplied by 1000.
     */
    uint16 private _rewardPercent;

    /**
     * @notice Staking lock time in block. 17280 is 24h
     */
    uint256 private _blocksPerReward;


    constructor() ERC20("Aeron", "ARN") public {
        _setupDecimals(8);
        setRewardPercent(1000);
        setBlocksPerReward(17280);
        _mint(msg.sender, 2000000000000000);
    }

    /**
     * @notice A method for a stakeholder to create a stake.
     * @param _stake The size of the stake to be created.
     */
    function createStake(uint256 _stake) public {
        _burn(msg.sender, _stake);
        if(stakes[msg.sender] == 0) addStakeholder(msg.sender);
        withdrawReward();
        startBlocks[msg.sender] = block.number;
        stakes[msg.sender] = stakes[msg.sender].add(_stake);
    }

    /**
     * @notice A method for a stakeholder to remove a stake.
     * @param _stake The size of the stake to be removed.
     */
    function removeStake(uint256 _stake) public {
        if(stakes[msg.sender] < _stake) return;
        withdrawReward();
        startBlocks[msg.sender] = block.number;
        stakes[msg.sender] = stakes[msg.sender].sub(_stake);
        if(stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _mint(msg.sender, _stake);
    }

    /**
     * @notice A method to retrieve the stake for a stakeholder.
     * @param _stakeholder The stakeholder to retrieve the stake for.
     * @return uint256 The amount of wei staked.
     */
    function stakeOf(address _stakeholder) public view returns(uint256) {
        return stakes[_stakeholder];
    }

    /**
     * @notice A method to the aggregated stakes from all stakeholders.
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
     * @notice A method to check if an address is a stakeholder.
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
     * @notice A method to add a stakeholder.
     * @param _stakeholder The stakeholder to add.
     */
    function addStakeholder(address _stakeholder) internal {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }

    /**
     * @notice A method to remove a stakeholder.
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
     * @notice A method to allow a stakeholder to check his rewards.
     * @param _stakeholder The stakeholder to check rewards for.
     */
    function rewardOf(address _stakeholder) public view returns(uint256) {
        if(startBlocks[_stakeholder] == 0) return 0;
        uint256 numberOfRewards = block.number.sub(startBlocks[_stakeholder]).div(_blocksPerReward);
        return stakes[_stakeholder].mul(numberOfRewards).mul(_rewardPercent).div(100000);
    }

    /**
     * @notice A method to the aggregated rewards from all stakeholders.
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
     * @notice A method to allow a stakeholder to withdraw his rewards.
     */
    function withdrawReward() public {
        uint256 reward = rewardOf(msg.sender);
        if(reward > 0) {
            startBlocks[msg.sender] = block.number;
            _mint(msg.sender, reward);
        }
    }

    /**
     * @notice A method to allow owner to set reward percent (multiplied by 1000).
     */
    function setRewardPercent(uint16 rewardPercent_) public onlyOwner {
        _rewardPercent = rewardPercent_;
    }

    /**
     * @notice A method to display reward percent multiplied by 1000.
     */
    function rewardPercent() public view returns (uint16) {
        return _rewardPercent;
    }

    /**
     * @notice A method to allow owner to set lock time for staking.
     */
    function setBlocksPerReward(uint256 blocksPerReward_) public onlyOwner {
        _blocksPerReward = blocksPerReward_;
    }

    /**
     * @notice A method to display staking lock time in blocks.
     */
    function blocksPerReward() public view returns (uint256) {
        return _blocksPerReward;
    }

    /**
     * @notice A method to display staking lock time in blocks.
     */
    function blocksTillReward(address _stakeholder) public view returns(uint256) {
        return _blocksPerReward.sub(block.number.sub(startBlocks[_stakeholder]).mod(_blocksPerReward));
    }
}
