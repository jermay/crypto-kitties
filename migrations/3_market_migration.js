const KittyFactory = artifacts.require("KittyFactory");
const KittyMarketPlace = artifacts.require("KittyMarketPlace");

module.exports = function (deployer) {
    deployer.deploy(KittyMarketPlace, KittyFactory.address);
};
