var expect = require('chai').expect;
const BN = web3.utils.BN
const truffleAssert = require('truffle-assertions');
const { createKitty, setOperator } = require('./kittyUtils');

const KittyMarketPlace = artifacts.require("KittyMarketPlace");
const TestKittyMarketPlace = artifacts.require("TestKittyMarketPlace");
const TestKittyFactory = artifacts.require("TestKittyFactory");

contract.only('KittyMarketPlace', (accounts) => {
    let kittyFactory;
    let kittyMarketPlace;
    const contractOwner = accounts[0];

    async function createContracts() {
        kittyFactory = await TestKittyFactory.new();
        kittyMarketPlace = await TestKittyMarketPlace.new(kittyFactory.address);
    }

    async function initContracts() {
        await createContracts();
        await kittyMarketPlace.setKittyContract(
            kittyFactory.address, { from: contractOwner });
    }

    function setOffer(price, kitty) {
        return kittyMarketPlace.setOffer(
            price, kitty.kittyId, { from: kitty.owner });
    }

    function expectOffer(result, expected) {
        expect(result.seller).to.equal(expected.seller);
        expect(result.price.toString(10)).to.equal(expected.price.toString(10));
        expect(result.index.toString(10)).to.equal(expected.index.toString(10));
        expect(result.tokenId.toString(10)).to.equal(expected.tokenId.toString(10));
        expect(result.active).to.equal(expected.active);
    }

    describe('Init', () => {

        it('should be deployed', async () => {
            const deployed = await KittyMarketPlace.deployed();
            expect(deployed).to.exist;
        });

        describe('set kitty contract', () => {
            beforeEach(async () => {
                await createContracts();
            });

            it('should set the kitty contract instance', async () => {
                await kittyMarketPlace.setKittyContract(
                    kittyFactory.address, { from: contractOwner });

                const result = await kittyMarketPlace.getKittyContractAddress();
                expect(result).to.equal(kittyFactory.address);
            });

            it('should REVERT if NOT called by the contract owner', async () => {
                await truffleAssert.reverts(
                    kittyMarketPlace.setKittyContract(
                        kittyFactory.address, { from: accounts[1] })
                );
            });
        });
    });

    describe('Market', () => {
        let kitty;
        let kittyOwner;
        const transTypes = {
            create: 'Create',
            remove: 'Remove',
            buy: 'Buy'
        };

        beforeEach(async () => {
            await initContracts();
            kittyOwner = accounts[1];
            kitty = {
                kittyId: new BN('1'),
                mumId: new BN('0'),
                dadId: new BN('0'),
                generation: new BN('0'),
                genes: new BN('1234567812345678'),
                owner: kittyOwner,
            }
            await createKitty(kittyFactory, kitty);
            await setOperator(kittyFactory, kittyOwner, kittyMarketPlace.address);
        });

        function expectMarketEvent(result, type, sender, tokenId) {
            truffleAssert.eventEmitted(
                result,
                "MarketTransaction",
                event => event.TxType === type &&
                    event.owner === sender &&
                    event.tokenId.toString(10) === tokenId.toString(10)
            );
        }

        describe('Set offer', () => {
            it('should REVERT if the market contract is not an approved operator for the sender', async () => {
                await kittyFactory.setApprovalForAll(
                    kittyMarketPlace.address, false, { from: kittyOwner });

                await truffleAssert.reverts(
                    kittyMarketPlace.setOffer(
                        new BN('1'), kitty.kittyId, { from: kittyOwner })
                );
            });

            it('should create a new offer for the token at the given price', async () => {
                const expOffer = {
                    seller: kitty.owner,
                    price: new BN('100'),
                    index: new BN('0'),
                    tokenId: kitty.kittyId,
                    active: true
                };

                await setOffer(expOffer.price, kitty);

                const result = await kittyMarketPlace.getOffer(kitty.kittyId);
                expectOffer(result, expOffer);
            });

            it('should emit a MarketTransaction event with type "Create"', async () => {
                const res = await setOffer(new BN('200'), kitty);

                expectMarketEvent(
                    res, transTypes.create, kitty.owner, kitty.kittyId
                );
            });

            it('should REVERT if the sender is not the token owner', async () => {
                const scammer = accounts[3];
                await kittyFactory.setApprovalForAll(
                    kittyMarketPlace.address, true, { from: scammer });

                await truffleAssert.reverts(
                    kittyMarketPlace.setOffer(
                        new BN('1'), kitty.kittyId, { from: scammer })
                );
            });

            it('should REVERT if there is an existing offer for the token', async () => {
                const res = await setOffer(new BN('200'), kitty);

                await truffleAssert.reverts(
                    setOffer(new BN('200'), kitty)
                );
            });
        });

        describe('Get Offer', () => {

            it('should get the offer for the token', async () => {
                const expOffer = {
                    seller: kitty.owner,
                    price: new BN('100'),
                    index: new BN('0'),
                    tokenId: kitty.kittyId,
                    active: true
                };

                await setOffer(expOffer.price, kitty);

                const result = await kittyMarketPlace.getOffer(kitty.kittyId);
                expectOffer(result, expOffer);
            });

            it('should REVERT if there is no active offer for that token', async () => {
                await truffleAssert.reverts(
                    kittyMarketPlace.getOffer(kitty.kittyId)
                );
            });
        });

        describe('Remove Offer', () => {
            beforeEach(async () => {
                await setOffer(new BN('100'), kitty);
            });

            it('should set the offer.active to false', async () => {
                await kittyMarketPlace.removeOffer(
                    kitty.kittyId, { from: kitty.owner });

                const result = await kittyMarketPlace
                    .hasActiveOffer(kitty.kittyId);
                expect(result).to.equal(false);
            });

            it('should emit a MarketTransaction event of type "Remove"', async () => {
                const res = await kittyMarketPlace.removeOffer(
                    kitty.kittyId, { from: kitty.owner });

                expectMarketEvent(
                    res, transTypes.remove, kitty.owner, kitty.kittyId
                );
            });

            it('should REVERT if sender is not the seller', async () => {
                const scammer = accounts[3];
                await truffleAssert.reverts(
                    kittyMarketPlace.removeOffer(
                        kitty.kittyId, { from: scammer })
                );
            });
        });

        describe('Buy Kitty', () => {
            let expPrice;
            let buyer = accounts[2];
            beforeEach(async () => {
                expPrice = new BN('100000');
                buyer = accounts[2];
                await setOffer(expPrice, kitty);
            });

            function buyKitty() {
                return kittyMarketPlace.buyKitty(
                    kitty.kittyId, { from: buyer, value: expPrice });
            }

            it('should send funds to the seller', async () => {
                const buyerBalBefore = new BN(await web3.eth.getBalance(buyer));
                const sellerBalBefore = new BN(await web3.eth.getBalance(kitty.owner));

                await buyKitty();

                const buyerBalAfter = new BN(await web3.eth.getBalance(buyer));
                const expBuyerBal = buyerBalBefore.sub(expPrice);
                expect(buyerBalAfter.lte(expBuyerBal));

                const sellerBalAfter = new BN(await web3.eth.getBalance(kitty.owner));
                const expSellerBal = sellerBalBefore.add(expPrice);
                expect(sellerBalAfter.toString(10)).to.equal(expSellerBal.toString(10));
            });

            it('should transfer the kitty to the buyer', async () => {
                await buyKitty();

                const newOwner = await kittyFactory.ownerOf(kitty.kittyId);
                expect(newOwner).to.equal(buyer);
            });

            it('should set the offer as inactive', async () => {
                await buyKitty();

                const result = await kittyMarketPlace.hasActiveOffer(kitty.kittyId);
                expect(result).to.equal(false);
            });

            it('should emit a MarketTransaction event of type "Buy"', async () => {
                const result = await buyKitty();

                

                expectMarketEvent(
                    result, transTypes.buy, buyer, kitty.kittyId
                );
            });

            it('should REVERT if the value sent does not equal the selling price', async () => {
                await truffleAssert.fails(
                    kittyMarketPlace.buyKitty(
                        kitty.kittyId, { from: buyer, value: 0 }),
                    truffleAssert.ErrorType.REVERT,
                    'payment must be exact'
                );
            });

            it('should REVERT if the order is not active', async () => {
                await kittyMarketPlace.removeOffer(
                    kitty.kittyId, { from: kitty.owner });

                await truffleAssert.fails(
                    buyKitty(),
                    truffleAssert.ErrorType.REVERT,
                    "offer not active"
                );
            });
        });

        describe('Get all tokens on sale', () => {
            let orders;
            let expOrders;
            async function createOrders(isActiveArray) {
                orders = [
                    {
                        seller: accounts[1],
                        price: new BN('1000'),
                        index: new BN('0'),
                        tokenId: new BN('1'),
                        active: true
                    },
                    {
                        seller: accounts[2],
                        price: new BN('2000'),
                        index: new BN('1'),
                        tokenId: new BN('2'),
                        active: false
                    },
                    {
                        seller: accounts[1],
                        price: new BN('1500'),
                        index: new BN('2'),
                        tokenId: new BN('3'),
                        active: true
                    },
                ];
                expOrders = orders.filter(
                    order => order.active
                );

                orders.forEach(async order =>
                    await kittyMarketPlace.setOffer(
                        order.seller,
                        order.price,
                        order.tokenId,
                        order.active
                    )
                );
            }

            it('should return only active orders', async () => {
                await createOrders();

                const results = await kittyMarketPlace.getAllTokenOnSale();

                expect(results.length).to.equal(expOrders.length);

                actualIds = results.map(r => r.toString(10));
                expOrders.map(o => o.tokenId.toString(10))
                    .forEach(expId => expect(actualIds).to.contain(expId));
            });
        });

    });
});

