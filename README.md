## About

This “New ARN” contract for Binance Smart Chain implements a simple staking version where the stakeholders periodically within a certain block interval receive a reward in tokens.

It will be further developed to enable graded rewards, based on the amounts staked or other variables.

In present implementation, stake is attached to a block number when it has been created, and reward is calculated as `staked amount` * `rewardPercent` * number of blocks `blocksPerReward` lapsed.

The contract owner can call `setRewardPercent`, `setBlocksPerReward`:  
`setRewardPercent (amount)` - define the reward magnitude (for example 500 = 0.5%; 1000 = 1% by default)  
`setBlocksPerReward (amount)` - define the number of blocks for the reward to accrue (17280 blocks = 24h by default)  

The token holders can call `createStake`, `removeStake`, `withdrawReward`:  
`createStake (amount)` - amount is burned, stake and block number are recorded. In case accrued reward exists, `withdrawReward` is called automatically  
`removeStake (amount)` - reduces the stake and resets the block number. In case accrued reward exists, `withdrawReward` is called automatically. Calls `_mint(amount)` to send the amount to the token holder  
`withdrawReward ()` - sends the whole accrued reward to the token holder, stake remains unchanged, resets the block number for the stake  

Public methods:  
`stakeOf (address)` - returns the current stake for the address  
`rewardOf (address)` - returns the accrued reward for the address  
`totalRewards` - total amount of all rewards currently held for all stakeholders  
`totalStakes` - total amount of all stakes  
`blocksTillReward (address)` - returns the number of blocks remaining till the next reward accrues for the address  
`blocksPerReward` - number of blocks required to pass for the reward to accrue  
`rewardPercent` - reward in percent of the staked amount multiplied by 1000  

https://explorer.binance.org/smart-testnet/address/0x3b13067E1d4c0664988731Ce096019B6b5052D27/read_contract


## Installation

- `git clone ...`
- `cd aeron-bep2e`
- `npm install`
- edit networks `vim truffle-config.js`
- `truffle compile`
- `npm run test` to test
- `npm run dev` to run on development network
- or deploy contract with [Remix](https://remix.ethereum.org/)
- `truffle-flattener contracts/AeronToken.sol | pbcopy` copy to verify contract code


## Binance Smart Chain

You can use Metamask to access Binance Smart Chain:

https://github.com/binance-chain/docs-site/blob/add-bsc/docs/smart-chain/wallet/metamask.md


## BEP2 > BEP2E Migration

1. Ensure both the BEP2 token and the BEP2E token both exist on each blockchain, with
the same total supply. BEP2E should have 3 more methods than typical ERC20:
  - a. symbol(): get token symbol
  - b. decimals(): get the number of the token decimal digits
  - c. owner(): get Binder contract owner’s address. This value should be initialized in
  the BEP2E contract constructor so that the further binding action can verify
  whether the binding gets the consent of the BEP2E owner.

2. Decide the initial circulation on both blockchains. Suppose the total supply is S, and the
expected initial circulating supply on BC is K, then the owner should lock S-K tokens to a
system controlled address on BC.

3. Equivalently, K tokens are locked in the special contract on BSC, which handles major
binding functions and is named as TokenHub. The issuer of the BEP2E token should lock
the K amount of that token into TokenHub, resulting in S-K tokens to circulate on BSC.
Thus the total circulation across 2 blockchains remains as S.

4. The issuer of BEP2 token sends the bind transaction on BC. Once the transaction is
executed successfully after proper verification:
  - a. It transfers S-K tokens to a system-controlled address on BC.
  - b. A cross-chain bind request package will be created, waiting for Relayers to relay.

5. BSC Relayers will relay the cross-chain bind request package into TokenHub on BSC, and
the corresponding request and information will be stored into the contract.

6. The contract owner and only the owner can run a special method of TokenHub contract,
ApproveBind, to verify the binding request to mark it as a success. It will confirm:
  - a. the token has not been bound;
  - b. the binding is for the proper symbol, with proper total supply and decimal
  information;
  - c. the proper locks are done on both networks;

7. Once the ApproveBind method has succeeded, TokenHub will mark the two tokens are
Bound and share the same circulation on BSC, and the status will be propagated back to
BC. After this final confirmation, the BEP2E contract address and decimals will be
written onto the BEP2 token as a new attribute on BC, and the tokens can be transferred
across the two blockchains bidirectionally. If the ApproveBind fails, the failure event will
also be propagated back to BC to release the locked tokens, and the above steps can be
re-tried later.
