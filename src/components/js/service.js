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
      kitty: '0x9312e2681EC932ab10a8733F4Ff60B4068D32B6F',
      market: '0xe59ff6CF2f513Ea166D6af2226D78705906EA6bB',
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
