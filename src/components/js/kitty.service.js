import Web3 from "web3";
import { abi } from './abi';

export class KittyService {
    web3 = new Web3(Web3.givenProvider);
    contractAddress = '0x4cbC3481fCf0124D56790c52c624a7Bae1AF6e7C';
    user;
    _contract;
    _contractPromise;
    kitties = [];
    birthSubscriptions = [];

    constructor() {
        this.subscribeToEvents();
        this.getKitties();
    }

    async getContract() {
        if (this._contract) {
            return this._contract;
        } else if (this._contractPromise) {
            return this._contractPromise;
        }

        this._contractPromise = window.ethereum.enable().then(accounts => {
            this._contract = new this.web3.eth.Contract(
                abi,
                this.contractAddress,
                { from: accounts[0] }
            );
            this.user = accounts[0];
            console.log('user: ', this.user, 'contract: ', this._contract);

            return this._contract;
        });

        return this._contractPromise;
    }

    async subscribeToEvents() {
        const instance = await this.getContract();
        instance.events.Birth()
            .on('data', this.onBirth)
            .on('error', console.error);
    }

    onBirth = (event) => {
        let birth = event.returnValues;
        console.log('Birth event: ', birth);

        // emit event
        this.birthSubscriptions.forEach(sub => sub(birth));
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
        return instance.methods.getKitty(id).call();
    }

    async getKitties() {        
        const instance = await this.getContract();
        const kittyIds = await instance.methods
            .kittiesOf(this.user)
            .call({ from: this.user });

        let promises = kittyIds.map(id => this.getKitty(id));
        this.kitties = await Promise.all(promises);

        // TODO: return kittyId from the contract method
        kittyIds.forEach((id, i) => this.kitties[i].kittyId = i);

        console.log(`Kittes for ${this.user} loaded: `, this.kitties);

        return this.kitties;
    }
}
