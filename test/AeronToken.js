const AeronToken = artifacts.require('AeronToken');
const { itShouldThrow } = require('./utils');

contract('AeronToken', (accounts) => {
    let token;
    let owner;
    let manyTokens;
    const user = accounts[1];

    before(async () => {
        token = await AeronToken.deployed();
        owner = await token.owner();
    });

    describe('Staking', () => {
        beforeEach(async () => {
            token = await AeronToken.new();
            owner = await token.owner();
            manyTokens  = await token.totalSupply();
        });

        itShouldThrow(
            'createStake requires a token balance equal or above the stake.',
            async () => {    
                await token.createStake(1, { from: user });
            },
            'ERC20: burn amount exceeds balance',
        );

        it('createStake creates a stake.', async () => {
            await token.transfer(user, 3, { from: owner });
            await token.createStake(1, { from: user });

            assert.equal(await token.balanceOf(user), 2);
            assert.equal(await token.stakeOf(user), 1);
            assert.equal(await token.totalSupply(), manyTokens-1);
            assert.equal(await token.totalStakes(), 1);
        });

        it('createStake adds a stakeholder.', async () => {
            await token.transfer(user, 3, { from: owner });
            await token.createStake(1, { from: user });
            
            assert.isTrue((await token.isStakeholder(user))[0]);
        });
        
        it('removeStake removes a stake.', async () => {
            await token.transfer(user, 3, { from: owner });
            await token.createStake(3, { from: user });
            await token.removeStake(1, { from: user });

            assert.equal(await token.balanceOf(user), 1);
            assert.equal(await token.stakeOf(user), 2);
            assert.equal(await token.totalSupply(), manyTokens-2);
            assert.equal(await token.totalStakes(), 2);
        });

        it('removeStake removes a stakeholder.', async () => {
            await token.transfer(user, 3, { from: owner });
            await token.createStake(3, { from: user });
            await token.removeStake(3, { from: user });

            assert.isFalse((await token.isStakeholder(user))[0]);
        });

        /*
        it('create Stake are distributed.', async () => {
            await token.transfer(user, 100, { from: owner });
            await token.createStake(100, { from: user });
            
            assert.equal(await token.balanceOf(user), 0);
            assert.equal(await token.totalRewards(), 1);
        });

        it('rewards can be withdrawn.', async () => {
            await token.transfer(user, 100, { from: owner });
            await token.createStake(100, { from: user });
            await token.withdrawReward({ from: user });
            
            const initialSupply = manyTokens;
            const existingStakes = 100;
            const mintedAndWithdrawn = 1;

            assert.equal(await token.balanceOf(user), 1);
            assert.equal(await token.stakeOf(user), 100);
            assert.equal(await token.rewardOf(user), 0);
            assert.equal(
                await token.totalSupply(), 
                initialSupply-existingStakes+mintedAndWithdrawn);
            assert.equal(await token.totalStakes(), 100);
            assert.equal(await token.totalRewards(), 0);
        });
        */
    });
});
