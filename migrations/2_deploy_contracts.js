const AeronToken = artifacts.require('AeronToken');
const AeronStaking = artifacts.require('AeronStaking');

module.exports = function(deployer, network, accounts) {
    deployer.deploy(AeronToken).then(token => {
      return deployer.deploy(AeronStaking, AeronToken.address).then(() => {
        return token.setStakingContract(AeronStaking.address);
        });
    });
};
