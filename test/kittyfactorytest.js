var expect = require('chai').expect;
const BN = web3.utils.BN
const truffleAssert = require('truffle-assertions');

const TestKittyFactory = artifacts.require("TestKittyFactory");
const KittyFactory = artifacts.require("KittyFactory");


contract('KittyFactory', async (accounts) => {
    let kittyFactory;
    let testAccount;

    beforeEach(async () => {
        kittyFactory = await TestKittyFactory.new();
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
                name: 'test kitty',
                dna: '1234567',
                generation: new BN('0')
            }
            transaction = await kittyFactory.birth(
                expKitty.name,
                expKitty.dna,
                { from: testAccount }
            );
        });

        it('should store the new kitty', async () => {
            result = await kittyFactory.getKitty(1);            
            expect(result.name).to.equal(expKitty.name);
            expect(result.dna).to.equal(expKitty.dna);
            expect(result.generation.toString(10), 'generation').to.equal(expKitty.generation.toString(10));
        });

        it('should record the ownership of the new kitty', async () => {
            const kittyOwer = await kittyFactory.ownerOf(1);
            expect(kittyOwer).to.equal(testAccount);
        });

        it('should update the owner count', async () => {
            const result = await kittyFactory.balanceOf(testAccount);
            expect(result.toString(10)).to.equal('1');
        });

        it('should emit a Birth event', async () => {
            truffleAssert.eventEmitted(
                transaction,
                'Birth',
                (event) => {
                    return event.kittyId.toString(10) === '1'
                        && event.name === expKitty.name
                        && event.dna === expKitty.dna
                        && event.generation.toString(10) === expKitty.generation.toString(10);
                }
            );
        });
    });
});