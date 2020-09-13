// import BN from 'bn.js';
import { abi } from './abi';
// import moment from 'moment';

import { kittyCooldowns } from './kittyConstants';

export class KittyService {
    contractAddress = '0x8593CB06daA1D6472e6203D0A4652B8F93f36f47';
    user;
    _contract;
    _contractPromise;
    kitties = [];
    birthSubscriptions = [];

    constructor(web3) {
        this.web3 = web3;

        this.subscribeToEvents();
        this.getKitties();
    }

    async getContract() {
        if (this._contract) {
            return this._contract;
        } else if (this._contractPromise) {
            return this._contractPromise;
        }

        this._contractPromise = this.web3.eth.getAccounts().then(accounts => {
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
        window.ethereum.on(
            'accountsChanged',
            accounts => this.user = accounts[0]
        );

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

    async isUserOwner() {
        const instance = await this.getContract();
        return instance.methods
            .isOwner()
            .call({ from: this.user });
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
        return instance.methods
            .getKitty(id)
            .call()
            .then(kitty => {
                kitty.cooldown = kittyCooldowns[kitty.cooldownIndex];
                return kitty;
            });
    }

    async getKitties() {
        const instance = await this.getContract();
        const kittyIds = await instance.methods
            .kittiesOf(this.user)
            .call({ from: this.user });

        let promises = kittyIds.map(id => this.getKitty(id));
        this.kitties = await Promise.all(promises);

        console.log(`Kittes for ${this.user} loaded: `, this.kitties);

        return this.kitties;
    }

    async breed(mumId, dadId) {
        const instance = await this.getContract();
        return instance.methods
            .breed(dadId, mumId)
            .send({ from: this.user });
    }

    async isApproved(address) {
        const instance = await this.getContract();
        return instance.methods
            .isApprovedForAll(this.user, address)
            .call({ from: this.user });
    }

    async approve(address) {
        // set the market as an approved operator
        const instance = await this.getContract();
        return instance.methods
            .setApprovalForAll(address, true)
            .send({ from: this.user })
            .then(() => true)
            .catch(err => {
                console.error(err);
                return false;
            });
    }
}
