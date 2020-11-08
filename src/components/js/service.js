import Web3 from 'web3';
import KittyService from './kitty.service';
import KittyMarketPlaceService from './kittyMarketPlace.service';
import WalletService from './walletService';

const KITTY_CONTRACT_ADDRESS = '0xBED527c80830cf4bBd51C6Ec5599424240d946C0';
const MARKET_CONTRACT_ADDRESS = '0x81287efD83dA314ff7cBD8F5221b909A8b6FF7B3';

export default class Service {
  static web3 = new Web3(Web3.givenProvider);
  static kitty = new KittyService(Service.web3, KITTY_CONTRACT_ADDRESS);
  static market = new KittyMarketPlaceService(Service.web3, Service.kitty, MARKET_CONTRACT_ADDRESS);
  static wallet = new WalletService(Service.web3);
}
