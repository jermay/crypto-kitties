import Web3 from "web3";
import { abi } from './abi';

export class KittyService {
    web3 = new Web3(Web3.givenProvider);
    contractAddress = '0x9015C97293858AC547d51043907845BDafbbe6EC';
    user;
    _contract;
    kitties = [];

    constructor() {
        this.subscribeToEvents();
        this.getKitties();
    }

    async getContract() {
        if (this._contract) {
            return this._contract;
        }

        const accounts = await window.ethereum.enable();
        this._contract = new this.web3.eth.Contract(
            abi,
            this.contractAddress,
            { from: accounts[0] }
        );
        this.user = accounts[0];
        console.log('contract: ', this._contract);

        return this._contract;
    }

    async subscribeToEvents() {
        const instance = await this.getContract();
        instance.events.Birth()
            .on('data', this.onBirth)
            .on('error', console.error);
    }

    onBirth = (event) => {
        console.log('Birth event: ', event);
    }

    async createGen0Kitty(dna) {
        const instance = await this.getContract();
        const result = await instance.methods
            .createKittyGen0(dna)
            .send({ from: this.user });

        console.log('kitty created! ', result);
    }

    async getKitty(id) {
        const instance = await this.getContract();
        return instance.getKitty(id).call();
    }

    async getKitties() {
        const instance = await this.getContract();
        const numKitties = await instance.methods.getGen0Count().call();
        console.log(`Loading ${numKitties} kitties...`);

        let promises = [];
        for (let i = 1; i <= numKitties; i++) {
            promises.push(instance.methods.getKitty(i).call());
        }

        this.kitties = await Promise.all(promises);
        console.log('Kittes loaded: ', this.kitties);

        return this.kitties;
    }
}
