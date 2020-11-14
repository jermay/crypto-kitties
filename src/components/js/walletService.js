import { EthNetworks } from '../wallet/networkSlice';

export default class WalletService {
  constructor(web3) {
    this.web3 = web3;
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
  }

  connect = async () => this.web3.eth.requestAccounts()
    .then((accounts) => accounts[0].toLowerCase())

  getNetwork = async () => this.web3.eth.getChainId()
    .then((chainId) => {
      const network = WalletService.getNetworkFromNum(chainId);
      // console.log('getNetwork: networkId: ', chainId, network);
      return network;
    })

  static getNetworkFromHex(hex) {
    const result = Object.values(EthNetworks)
      .find((network) => network.id === hex);
    return result || {};
  }

  static getNetworkFromNum(num) {
    const result = Object.values(EthNetworks)
      .find((network) => network.num === num);
    return result || {};
  }
}
