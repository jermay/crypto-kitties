import { abi } from './kittyMarketplace.abi';


export default class KittyMarketPlaceService {
  contractAddress; // address
  user; // address
  contract; // Web3.eth.Contract
  contractPromise; // Promise<Web3.eth.Contract>
  kittyService; // KittyService
  marketSubscriptions = []; // [func]

  constructor(web3) {
    this.web3 = web3;
  }

  init = async (contractAddress, kittyService) => {
    this.contractAddress = contractAddress;
    this.kittyService = kittyService;
    this.contractPromise = null;
    this.contract = null;
    await this.createContractInstance();
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
      // console.log('user: ', this.user, 'market contract: ', this.contract);

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

  subscribe = (callback) => {
    this.marketSubscriptions.push(callback);
  }

  unsubscribe = (callback) => {
    const i = this.marketSubscriptions.findIndex(callback);
    if (i >= 0) {
      this.marketSubscriptions.splice(i, 1);
    }
  }

  async subscribeToEvents() {
    window.ethereum.on(
      'accountsChanged',
      this.onAccountChanged
    );

    const instance = await this.getContract();
    instance.events.MarketTransaction()
      .on('data', this.onMarketEvent)
      .on('error', console.error);
  }

  onMarketEvent = (event) => {
    const trans = event.returnValues;
    const cleanTrans = {
      TxType: trans.TxType,
      owner: trans.owner.toLowerCase(),
      tokenId: trans.tokenId,
    };
    // console.log('On Marketplace event: ', cleanTrans,
    //   'subscriptions: ', this.marketSubscriptions.length);

    // emit event
    this.marketSubscriptions.forEach((sub) => sub(cleanTrans));
  }

  onAccountChanged = (accounts) => {
    // console.log('account changed: ', accounts);
    this.user = accounts[0];
  }

  getKitty = async (id) => this.kittyService.getKitty(id)

  getOffer = async (tokenId) => {
    // TODO: add hasOffer(uint256 _tokenId) function to contract
    // to avoid revert as it spams the console with error messages
    // even though it's caught
    const instance = await this.getContract();
    return instance.methods.getOffer(tokenId)
      .call({ from: this.user, })
      .then((offer) => ({
        seller: offer.seller.toLowerCase(),
        price: offer.price,
        index: offer.index,
        tokenId: offer.tokenId,
        isSireOffer: offer.isSireOffer,
        active: offer.active,
      }))
      .catch((err) => {
        if (!err.message.includes('offer not active')) {
          console.error(err);
        }
        return undefined;
      });
  }

  getOffers = async () => {
    const sellOffers = await this.getAllTokenOnSale();
    const sireOffers = await this.getAllSireOffers();
    const allOffers = sellOffers.concat(sireOffers);
    return allOffers;
  }

  getAllTokenOnSale = async () => {
    const instance = await this.getContract();
    const offerIds = await instance.methods
      .getAllTokenOnSale()
      .call({ from: this.user, });

    const offers = await this.getOffersForIds(offerIds);
    // console.log(`Sell offers loaded: `, offers);

    return offers;
  }

  getOffersForIds = async (tokenIds) => {
    const promises = tokenIds.map((id) => this.getOffer(id));
    const offers = await Promise.all(promises);

    return offers;
  }

  getAllSireOffers = async () => {
    // console.log('getting sire offers');
    const instance = await this.getContract();
    const offerIds = await instance.methods
      .getAllSireOffers()
      .call({ from: this.user, });

    const offers = await this.getOffersForIds(offerIds);
    // console.log('Sire offers loaded: ', offers);

    return offers;
  }

  isApproved = async () => this.kittyService
    .isApproved(this.contractAddress)

  // set the market as an approved operator
  approve = async () => this.kittyService
    .approve(this.contractAddress)


  sellKitty = async (kittyId, price) => {
    // console.log('kittyId: ', kittyId, ' price: ', price, typeof price);

    // throw if market is NOT operator
    // call contract to sell kitty
    const instance = await this.getContract();
    const priceInWei = this.web3.utils
      .toWei(price, 'ether');

    return instance.methods
      .setOffer(priceInWei, kittyId)
      .send({ from: this.user, })
      .then(() => true);
  }

  buyKitty = async (offer) => {
    // TODO: check user balance for insufficient funds
    const instance = await this.getContract();
    return instance.methods
      .buyKitty(offer.tokenId)
      .send({ from: this.user, value: offer.price, })
      .then(() => true);
  }

  setSireOffer = async (kittyId, price) => {
    const instance = await this.getContract();
    const priceInWei = this.web3.utils
      .toWei(price, 'ether');
    // console.log(`Creating sire offer of ${price} for kittyId: ${kittyId}`);

    return instance.methods
      .setSireOffer(priceInWei, kittyId)
      .send({ from: this.user, })
      .then(() => true);
  }

  buySireRites = async (offer, matronId) => {
    // console.log('buySireRites:: offer: ', offer, ' matronId: ', matronId);
    const instance = await this.getContract();
    return instance.methods
      .buySireRites(offer.tokenId, matronId)
      .send({ from: this.user, value: offer.price, })
      .then(() => true);
  }

  removeOffer = async (tokenId) => {
    // console.log('Removing offer for kittyId:', tokenId);
    const instance = await this.getContract();
    return instance.methods
      .removeOffer(tokenId)
      .send({ from: this.user, })
      .then(() => true);
  }
}
