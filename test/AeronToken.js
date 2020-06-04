const AeronToken = artifacts.require('AeronToken');
const AeronStaking = artifacts.require('AeronStaking');
const Upgradable = artifacts.require('UpgradableTest');

contract('AeronToken', (accounts) => {
    let token;
    let owner;
    let manyTokens;
    const user = accounts[1];

    before(async () => {
        token = await AeronToken.deployed();
        owner = await token.owner();
    });

    describe('Token', () => {

        beforeEach(async () => {
            token = await AeronToken.new();
            owner = await token.owner();
            manyTokens  = await token.totalSupply();
        });

        it('should return the balance of token', async () => {
            await token.transfer(user, 300000000, { from: owner });
            assert.equal(await token.balanceOf(user), 300000000);
            assert.equal(await token.balanceOf(owner), manyTokens-300000000);
        });


        it('should set staking contract address', async () => {
            await token.transfer(user, 300000000, { from: owner });
            assert.equal(await token.balanceOf(user), 300000000);
            assert.equal(await token.balanceOf(owner), manyTokens-300000000);
        });

    });


    describe('Staking', () => {

        beforeEach(async () => {
            token = await AeronToken.new();
            owner = await token.owner();
            manyTokens  = await token.totalSupply();
            stakingContract = await AeronStaking.new(token.address);
            await token.setStakingContract(stakingContract.address);
        });

        it('should set staking contract on token contract', async () => {
            assert.equal(await stakingContract.address, await token.stakingContract());
        });

        it('should set staking contract on token contract', async () => {
            assert.equal(await stakingContract.address, await token.stakingContract());
        });

    });

    describe('Upgrade', () => {

        beforeEach(async () => {
            token = await AeronToken.new();
            owner = await token.owner();
            manyTokens  = await token.totalSupply();
            stakingContract = await AeronStaking.new(token.address);
            await token.setStakingContract(stakingContract.address);
            upgradableContract = await Upgradable.new(token.address, stakingContract.address);
            

        });

        it('should be upgradable', async () => {
            await token.transfer(user, 300000000, { from: owner });
            assert.equal(await token.balanceOf(user), 300000000);
            assert.equal(await token.balanceOf(owner), manyTokens-300000000);
        });


    });

});
