// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AeronToken is ERC20, Ownable {

    address internal _staking_contract;

    constructor() ERC20("Aeron", "ARN") public {
        _setupDecimals(8);
        _mint(msg.sender, 5000000000000000);
    }

    function setStakingContract(address staking_contract) public onlyOwner {
        _staking_contract = staking_contract;
    }

    function stakingContract() public view returns (address) {
        return _staking_contract;
    }

   function mint(address to, uint256 amount) public {
        require((msg.sender == _staking_contract), "Caller is not a staking contract");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        require((msg.sender == _staking_contract), "Caller is not a staking contract");
        _burn(from, amount);
    }
}
