// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.7;

import "./Upgradable.sol";

contract UpgradableTest is Upgradable {
    using SafeMath for uint256;

    constructor(AeronStaking legacy_contract) public {
        importStakeholders(legacy_contract);
    }

    function test_stakeholders() public view returns (address) {
        return stakeholders[0];
    }

}
