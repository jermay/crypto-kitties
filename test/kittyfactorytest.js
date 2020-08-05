var expect = require('chai').expect;
const BN = web3.utils.BN
const truffleAssert = require('truffle-assertions');

const TestKittyFactory = artifacts.require("TestKittyFactory");
const KittyFactory = artifacts.require("KittyFactory");


contract('KittyFactory', async (accounts) => {
    let kittyFactory;
    let contractOwner;
    let testAccount;

    beforeEach(async () => {
        kittyFactory = await TestKittyFactory.new();
        contractOwner = accounts[0];
        testAccount = accounts[1];
    });

    it('should be created', async () => {
        const instance = await KittyFactory.deployed();
        expect(instance).to.exist;
    });

    describe('birth', () => {
        let expKitty;
        let transaction;
        beforeEach(async () => {
            expKitty = {
                mumId: new BN('0'),
                dadId: new BN('0'),
                generation: new BN('0'),
                genes: new BN('1234567812345678'),
                owner: contractOwner,
            }
            await addGen0Kitty();
        });

        async function addGen0Kitty() {
            transaction = await kittyFactory.createKittyGen0(
                expKitty.genes,
                { from: contractOwner }
            );
        }

        it('should store the new kitty', async () => {
            result = await kittyFactory.getKitty(1);
            expect(result.mumId.toString(10)).to.equal(expKitty.mumId.toString(10));
            expect(result.dadId.toString(10)).to.equal(expKitty.dadId.toString(10));
            expect(result.generation.toString(10), 'generation').to.equal(expKitty.generation.toString(10));
            expect(result.genes.toString(10)).to.equal(expKitty.genes.toString(10));

            const actualOwner = await kittyFactory.ownerOf(1);
            expect(actualOwner).to.equal(expKitty.owner);
        });

        it('should record the ownership of the new kitty', async () => {
            const kittyOwer = await kittyFactory.ownerOf(1);
            expect(kittyOwer).to.equal(contractOwner);
        });

        it('should update the owner count', async () => {
            const result = await kittyFactory.balanceOf(contractOwner);
            expect(result.toString(10)).to.equal('1');
        });

        it('should emit a Birth event', async () => {
            truffleAssert.eventEmitted(
                transaction,
                'Birth',
                (event) => {
                    return event.owner === expKitty.owner
                        && event.kittyId.toString(10) === '1'
                        && event.mumId.toString(10) === expKitty.mumId.toString(10)
                        && event.dadId.toString(10) === expKitty.dadId.toString(10)
                        && event.genes.toString(10) === expKitty.genes.toString(10)
                }
            );
        });

        it('should update the gen 0 counter', async () => {
            const result = await kittyFactory.getGen0Count();
            expect(result.toString(10)).to.equal('1');
        });

        it('should REJECT if gen 0 counter would exceed the gen 0 creation limit', async () => {
            // make more kitties than the limit
            const makeKitties = async () => {
                for (let i=0; i < 11; i++) {
                    await addGen0Kitty();
                }
            }
            await truffleAssert.fails(
                makeKitties(),
                truffleAssert.ErrorType.REVERT
            );
        });
    });
});