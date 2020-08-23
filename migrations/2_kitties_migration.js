const KittyFactory = artifacts.require("KittyFactory");
const KittyMarketPlace = artifacts.require("KittyMarketPlace");

module.exports = function (deployer) {
  deployer.deploy(KittyFactory);
  deployer.deploy(KittyMarketPlace).then(
    instance => instance.setKittyContract(KittyFactory.address)
  );
};
