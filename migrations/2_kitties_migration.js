const KittyFactory = artifacts.require("KittyFactory");

module.exports = function (deployer) {
  deployer.deploy(KittyFactory);
};
