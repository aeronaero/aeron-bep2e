// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.7;

import "./Upgradable.sol";

contract UpgradableTest is Upgradable {
    using SafeMath for uint256;

    constructor(AeronToken token, AeronStaking legacy_contract) public {
        importStakeholders(token, legacy_contract);
    }

}
