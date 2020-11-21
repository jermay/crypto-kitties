import { abi } from './abi';
import { kittyCooldowns, zeroAddress } from './kittyConstants';

export default class KittyService {
  contractAddress; // address
  user; // address
  contract; // Web3.eth.Contract
  contractPromise; // Promise<Web3.eth.Contract>
  birthSubscriptions = []; // [func]

  constructor(web3) {
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

  async subscribeToEvents() {
    window.ethereum.on(
      'accountsChanged',
      (accounts) => { this.user = accounts[0]; }
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
    const birth = event.returnValues;
    // console.log('Birth event: ', birth);

    const cleanedEvent = {
      owner: birth.owner.toLowerCase(),
      kittyId: birth.kittyId,
      mumId: birth.mumId,
      dadId: birth.dadId,
      genes: birth.genes,
    };

    // emit event
    this.birthSubscriptions.forEach((sub) => sub(cleanedEvent));
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
      .then((creators) => creators.filter((c) => c !== zeroAddress));
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
