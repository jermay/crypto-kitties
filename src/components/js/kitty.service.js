import EventEmitter from 'events';
import { abi } from './abi';
import { kittyCooldowns, zeroAddress } from './kittyConstants';

export default class KittyService extends EventEmitter {
  static eventNames = {
    Birth: 'Birth',
    KittyCreatorAdded: 'KittyCreatorAdded',
    KittyCreatorRemoved: 'KittyCreatorRemoved',
  };

  contractAddress; // address
  user; // address
  contract; // Web3.eth.Contract
  contractPromise; // Promise<Web3.eth.Contract>

  constructor(web3) {
    super();
    this.web3 = web3;
  }

  init = async (contractAddress) => {
    this.contractAddress = contractAddress;
    await this.createContractInstance(contractAddress);
    this.subscribeToEvents();
  }

  createContractInstance = async () => {
    if (!this.contractAddress) {
      throw new Error('No contract address! Attempting to use contract before initialization');
    }

    this.contractPromise = this.web3.eth.getAccounts().then((accounts) => {
      this.contract = new this.web3.eth.Contract(
        abi,
        this.contractAddress,
        { from: accounts[0], }
      );
      this.user = accounts[0];
      // console.log('user: ', this.user, 'kitty contract: ', this.contract);

      return this.contract;
    });

    return this.contractPromise;
  }

  async getContract() {
    if (this.contract) {
      return this.contract;
    }
    if (this.contractPromise) {
      return this.contractPromise;
    }

    return this.createContractInstance();
  }

  /**
   * Initializes the contract event subscriptions
   * so they can be re-emitted and/or handled
   */
  async subscribeToEvents() {
    window.ethereum.on(
      'accountsChanged',
      (accounts) => { this.user = accounts[0]; }
    );

    const instance = await this.getContract();
    instance.events.Birth()
      .on('data', this.onContractEvent)
      .on('error', console.error);

    instance.events.KittyCreatorAdded()
      .on('data', this.onContractEvent)
      .on('error', console.error);

    instance.events.KittyCreatorRemoved()
      .on('data', this.onContractEvent)
      .on('error', console.error);
  }

  /**
   * Extracts data for the Brith event
   * @param {*} values web3 event return values
   */
  getBirthEventData = (values) => ({
    // remove checksum capitalization for comparison consistancy
    owner: values.owner.toLowerCase(),
    kittyId: values.kittyId,
    mumId: values.mumId,
    dadId: values.dadId,
    genes: values.genes,
  });

  /**
   * Extacts the event data for the
   * KittyCreatorAdded and KittyCreatorRemoved events
   * as both events have the same params
   * @param {*} values web3 event return values
   */
  getKittyCreatorEventData = (values) => ({
    // remove checksum capitalization for comparison consistancy
    creator: values.creator.toLowerCase(),
  });

  /**
   * Extracts a sanitized version of the event return values.
   * Uses the event name to call the appropriate extractor
   * @param {string} eventName contract event name
   * @param {*} values web3 event return values
   */
  getContractEventData = (eventName, values) => {
    // remove the extra stuff added by web3.js
    let data = {};
    switch (eventName) {
      case KittyService.eventNames.Birth:
        data = this.getBirthEventData(values);
        break;

      case KittyService.eventNames.KittyCreatorAdded:
      case KittyService.eventNames.KittyCreatorRemoved:
        data = this.getKittyCreatorEventData(values);
        break;

      default:
        break;
    }

    return data;
  };

  /**
   * Handles events coming from the contract
   * Extracts sanitizes the event data and re-emits the event
   * to subscribers of the service
   * @param {*} eventArgs the web3.js event
   */
  onContractEvent = (eventArgs) => {
    const values = eventArgs.returnValues;
    const eventName = eventArgs.event;

    const data = this.getContractEventData(eventName, values);
    this.emit(eventName, data);
    // console.log('KittyService::onContractEvent: ', eventName, data);
  }

  /**
   * Return true if the current user is the contract owner
   * @returns {Promise<boolean>}
   */
  isUserOwner = async () => {
    const instance = await this.getContract();
    return instance.methods
      .isOwner()
      .call({ from: this.user, });
  }

  /**
   * Returns true if the current user is allowed
   * to create generation zero kitties
   * @returns {Promise<boolean>}
   */
  isUserKittyCreator = async () => {
    const instance = await this.getContract();
    return instance.methods
      .isKittyCreator(this.user)
      .call({ from: this.user, });
  }

  /**
   * Returns a list of all the Kitty Creator addresses
   * @returns {Promise<string[]>}
   */
  getAllKittyCreators = async () => {
    const instance = await this.getContract();
    return instance.methods
      .getKittyCreators()
      .call({ from: this.user, })
      .then((creators) => creators
        .filter((c) => c !== zeroAddress)
        // remove checksum capitalization for comparison consistancy
        .map((c) => c.toLowerCase()));
  }

  /**
   * Adds a new Kitty Creator permission for the given address
   * @param {string} address address to add
   * @returns {Promise<string>} the transaction hash
   */
  addKittyCreator = async (address) => {
    const instance = await this.getContract();
    return instance.methods
      .addKittyCreator(address)
      .send({ from: this.user, })
      .then((txRecepit) => txRecepit.transactionHash);
  };

  /**
   * Removes the Kitty Creator permission for the given address
   * @param {string} address address to remove
   * @returns {Promise<string>} the transaction hash
   */
  removeKittyCreator = async (address) => {
    const instance = await this.getContract();
    return instance.methods
      .removeKittyCreator(address)
      .send({ from: this.user, })
      .then((txRecepit) => txRecepit.transactionHash);
  };

  /**
   * Creates a special new kitten with no parents.
   * Will have generation zero
   * @param {string} dna the DNA of the new kitten
   * @throws if sender is not the contract owner
   * @returns {Promise<string>} the transaction hash on success
   */
  createGen0Kitty = async (dna) => {
    const instance = await this.getContract();
    return instance.methods
      .createKittyGen0(dna)
      .send({ from: this.user, })
      .then((txRecepit) => txRecepit.transactionHash);
  }

  /**
   * Returns the current number of generation
   * zero kitties which have been created
   * @returns {Promise<number>}
   */
  getGen0Count = async () => {
    const instance = await this.getContract();
    return instance.methods
      .getGen0Count()
      .call()
      .catch((err) => {
        console.error(err);
        return err;
      });
  };

  /**
   * Returns the total number of generation zero
   * kitties which can exist
   * @returns {Promise<number>}
   */
  getGen0Limit = async () => {
    const instance = await this.getContract();
    return instance.methods
      .CREATION_LIMIT_GEN0()
      .call()
      .catch((err) => {
        console.error(err);
        return err;
      });
  };

  getKitty = async (id) => {
    const instance = await this.getContract();
    return instance.methods
      .getKitty(id)
      .call()
      .then((kitty) => ({
        kittyId: id,
        genes: kitty.genes,
        birthTime: kitty.birthTime,
        cooldownEndTime: kitty.cooldownEndTime,
        mumId: kitty.mumId,
        dadId: kitty.dadId,
        generation: kitty.generation,
        cooldownIndex: kitty.cooldownIndex,
        cooldown: kittyCooldowns[kitty.cooldownIndex],
        owner: kitty.owner.toLowerCase(),
      }));
  }

  getKitties = async () => {
    const instance = await this.getContract();
    const kittyIds = await instance.methods
      .kittiesOf(this.user)
      .call({ from: this.user, });

    const promises = kittyIds.map((id) => this.getKitty(id));
    this.kitties = await Promise.all(promises);

    // console.log(`Kittes for ${this.user} loaded: `, this.kitties);

    return this.kitties;
  }

  getKittesForIds = async (kittyIds) => {
    if (!kittyIds || !kittyIds.length) {
      return [];
    }

    return Promise.all(kittyIds.map(
      (kittyId) => this.getKitty(kittyId)
    ));
  }

  breed = async (mumId, dadId) => {
    const instance = await this.getContract();
    return instance.methods
      .breed(dadId, mumId)
      .send({ from: this.user, })
      .then((result) => result.transactionHash);
  }

  isApproved = async (address) => {
    const instance = await this.getContract();
    return instance.methods
      .isApprovedForAll(this.user, address)
      .call({ from: this.user, });
  }

  approve = async (address) => {
    // set the market as an approved operator
    const instance = await this.getContract();
    return instance.methods
      .setApprovalForAll(address, true)
      .send({ from: this.user, })
      .then(() => true);
  }
}
