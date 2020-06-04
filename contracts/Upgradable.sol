// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.7;

import "./AeronStaking.sol";

/**
* @dev Template contract for future updates of AeronStaking.
* Contract features a stakeholders state import from legacy contract.
*
* AeronToken's contract owner should call setStakingContract(address)
* on AeronToken to set a new staking address after new AeronStaking deployment.
*/

contract Upgradable {
    using SafeMath for uint256;

    address[] internal stakeholders;
    mapping (address => uint256) internal stakes;
    mapping (address => uint256) internal blocks;

    function importStakeholders(AeronStaking legacy_contract) internal virtual returns (uint256) {
        // Import stakeholders state from legacy contract.
        stakeholders = legacy_contract.exportStakeholders();
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            stakes[stakeholders[s]] = legacy_contract.stakeOf(stakeholders[s]);
            blocks[stakeholders[s]] = legacy_contract.blockOf(stakeholders[s]);
        }
        return stakeholders.length;
    }

}
