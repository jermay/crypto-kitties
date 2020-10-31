export const networks = {
    "0x1": { id: '0x1', num: 1, name: 'Etereum MainNet' },
    "0x3": { id: '0x3', num: 3, name: 'Ropsten Test' },
    "0x4": { id: '0x4', num: 4, name: 'Rinkeby Test' },
    "0x5": { id: '0x5', num: 5, name: 'Goerli Test' },
    "0x2a": { id: '0x2a', num: 42, name: 'Kovan Test' },
    "0xNaN": { id: '0xNaN', num: 1337, name: 'Ganache Local' }
}


export class WalletService {

    localNetwork = networks["0x539"]; // ganache
    testNetwork = null;

    constructor(web3) {
        this.web3 = web3;
        if (window.ethereum) {
            window.ethereum.autoRefreshOnNetworkChange = false;
        }
    }

    connect = async () => {
        return this.web3.eth.requestAccounts()
            .then(accounts => accounts[0].toLowerCase());
    }

    getNetwork = async () => {
        return this.web3.eth.getChainId()
            .then(chainId => {
                const network = this.getNetworkFromNum(chainId);
                // console.log('getNetwork: networkId: ', chainId, network);
                return network;
            });
    }

    getNetworkFromHex(hex) {
        const result = Object.values(networks)
            .find(network => network.id === hex);
        return result || {};
    }

    getNetworkFromNum(num) {
        const result = Object.values(networks)
            .find(network => network.num === num);
        return result || {};
    }
}