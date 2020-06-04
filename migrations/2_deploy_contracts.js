const AeronToken = artifacts.require("AeronToken");
const AeronStaking = artifacts.require("AeronStaking");

module.exports = async function(deployer) {
  await deployer.deploy(AeronToken);
  const token = await AeronToken.deployed();

  await deployer.deploy(AeronStaking, token.address);
  const staking = await AeronStaking.deployed();

  await token.setStakingContract(staking.address);
};
