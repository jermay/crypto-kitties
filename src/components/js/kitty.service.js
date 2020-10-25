// import BN from 'bn.js';
import { abi } from './abi';

import { kittyCooldowns } from './kittyConstants';

export class KittyService {
    contractAddress = '0xBED527c80830cf4bBd51C6Ec5599424240d946C0';
    user;
    _contract;
    _contractPromise;
    kitties = [];
    birthSubscriptions = [];

    constructor(web3) {
        this.web3 = web3;

        this.subscribeToEvents();
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
            console.log('user: ', this.user, 'kitty contract: ', this._contract);

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

    subscribeToBirthEvent = (callback) => {
        this.birthSubscriptions.push(callback);
    }

    unSubscribeToBirthEvent = (callback) => {
        const i = this.birthSubscriptions.indexOf(callback);
        if (i >= 0) {
            this.birthSubscriptions.splice(i, 1);
        }
    }

    onBirth = (event) => {
        let birth = event.returnValues;
        console.log('Birth event: ', birth);

        const cleanedEvent = {
            owner: birth.owner.toLowerCase(),
            kittyId: birth.kittyId,
            mumId: birth.mumId,
            dadId: birth.dadId,
            genes: birth.genes
        }

        // emit event
        this.birthSubscriptions.forEach(sub => sub(cleanedEvent));
    }

    isUserOwner = async () => {
        const instance = await this.getContract();
        return instance.methods
            .isOwner()
            .call({ from: this.user });
    }

    createGen0Kitty = async (dna) => {
        const instance = await this.getContract();
        const result = await instance.methods
            .createKittyGen0(dna)
            .send({ from: this.user });

        console.log('kitty created! ', result);
    }

    getKitty = async (id) => {
        const instance = await this.getContract();
        return instance.methods
            .getKitty(id)
            .call()
            .then(kitty => {
                return {
                    kittyId: id,
                    genes: kitty.genes,
                    birthTime: kitty.birthTime,
                    cooldownEndTime: kitty.cooldownEndTime,
                    mumId: kitty.mumId,
                    dadId: kitty.dadId,
                    generation: kitty.generation,
                    cooldownIndex: kitty.cooldownIndex,
                    cooldown: kittyCooldowns[kitty.cooldownIndex],
                    owner: kitty.owner.toLowerCase()
                };
            });
    }

    getKitties = async () => {
        const instance = await this.getContract();
        const kittyIds = await instance.methods
            .kittiesOf(this.user)
            .call({ from: this.user });

        let promises = kittyIds.map(id => this.getKitty(id));
        this.kitties = await Promise.all(promises);

        // console.log(`Kittes for ${this.user} loaded: `, this.kitties);

        return this.kitties;
    }

    getKittesForIds = async (kittyIds) => {
        if (!kittyIds || !kittyIds.length) {
            return [];
        }

        return Promise.all(kittyIds.map(
            kittyId => this.getKitty(kittyId)
        ));
    }

    breed = async (mumId, dadId) => {
        const instance = await this.getContract();
        return instance.methods
            .breed(dadId, mumId)
            .send({ from: this.user })
            .then(result => result.transactionHash);
    }

    isApproved = async (address) => {
        const instance = await this.getContract();
        return instance.methods
            .isApprovedForAll(this.user, address)
            .call({ from: this.user });
    }

    approve = async (address) => {
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
