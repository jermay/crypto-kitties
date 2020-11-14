import Web3 from 'web3';
import KittyService from './kitty.service';
import KittyMarketPlaceService from './kittyMarketPlace.service';
import WalletService from './walletService';

export default class Service {
  static chainIdToAddress = {
    // '0x1': // Etereum MainNet
    // '0x3': // Ropsten Test'
    '0x539': {
      // Ganache Local
      kitty: '0xBED527c80830cf4bBd51C6Ec5599424240d946C0',
      market: '0x81287efD83dA314ff7cBD8F5221b909A8b6FF7B3',
    },
  };

  static web3 = new Web3(Web3.givenProvider);
  static kitty = new KittyService(Service.web3);
  static market = new KittyMarketPlaceService(Service.web3);
  static wallet = new WalletService(Service.web3);

  static initContracts = async (chainId) => {
    const contractAddresses = this.chainIdToAddress[chainId];
    if (!contractAddresses) {
      throw new Error(`Contract init error. Unsupported chainId: ${chainId}`);
    }

    Service.kitty.init(contractAddresses.kitty);
    Service.market.init(contractAddresses.market, Service.kitty);
  }
}
