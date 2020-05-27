const AeronToken = artifacts.require('AeronToken');

module.exports = function(deployer, network, accounts) {
    deployer.deploy(
      AeronToken
    );
};
