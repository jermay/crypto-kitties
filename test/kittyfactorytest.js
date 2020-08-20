var expect = require('chai').expect;
const BN = web3.utils.BN
const truffleAssert = require('truffle-assertions');
const { assert } = require('chai');

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

    async function addGen0Kitty(dna) {
        return kittyFactory.createKittyGen0(
            dna,
            { from: contractOwner }
        );
    }

    async function createKitty(kitty) {
        return kittyFactory.createKitty(
            kitty.mumId,
            kitty.dadId,
            kitty.generation,
            kitty.genes,
            kitty.owner
        );
    }

    function expectKitty(kitty, expected) {
        expect(kitty.mumId.toString(10)).to.equal(expected.mumId.toString(10));
        expect(kitty.dadId.toString(10)).to.equal(expected.dadId.toString(10));
        expect(kitty.genes.toString(10)).to.equal(expected.genes.toString(10));
        expect(kitty.generation.toString(10)).to.equal(expected.generation.toString(10));
    }

    describe('Create Gen 0 Kitty', () => {
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
            transaction = await addGen0Kitty(expKitty.genes);
        });

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
                for (let i = 0; i < 11; i++) {
                    await addGen0Kitty(expKitty.genes);
                }
            }
            await truffleAssert.fails(
                makeKitties(),
                truffleAssert.ErrorType.REVERT
            );
        });
    });

    describe('Kittes of', () => {
        let testKitties;
        beforeEach(async () => {
            testKitties = [
                {
                    mumId: new BN('0'),
                    dadId: new BN('0'),
                    generation: new BN('0'),
                    genes: new BN('1111111111111111'),
                    owner: contractOwner,
                },
                {
                    mumId: new BN('0'),
                    dadId: new BN('0'),
                    generation: new BN('0'),
                    genes: new BN('2222222222222222'),
                    owner: testAccount,
                },
                {
                    mumId: new BN('0'),
                    dadId: new BN('0'),
                    generation: new BN('0'),
                    genes: new BN('3333333333333333'),
                    owner: contractOwner,
                },
            ]
            await Promise.all(testKitties.map(kitty => createKitty(kitty)));
        });

        it('should return all the kittyIds owned by the given address', async () => {
            exptectedIds = ['1', '3'];

            results = await kittyFactory.kittiesOf(contractOwner);

            expect(results.length).to.equal(exptectedIds.length);
            results
                .map(id => id.toString(10))
                .forEach(id => expect(exptectedIds).to.contain(id));
        });

        it('should return an empty array if the owner has no kitties', async () => {

            result = await kittyFactory.kittiesOf(accounts[2]);

            expect(result.length).to.equal(0);
        });
    });

    describe.only('Mix DNA', ()=>{
        let mumDna;
        let dadDna
        let seed;
        const geneSizes = [2,2,2,2,1,1,2,2,1,1];
        let expDna;
        beforeEach(()=>{
            mumDna = '1122334456778890';
            dadDna = '9988776604332215';
            seed = 1705; // % 1023 = 10 1010 1010 in binary
            
            // 1= dad, 0=mum
            expDna = new BN('9922774406338810');
        });

        it('should mix the DNA according to the mask and seed',async()=>{
            const result = await kittyFactory.mixDna(dadDna, mumDna, seed);

            expect(result.toString(10)).to.equal(expDna.toString(10));
        });
    });

    describe('breed', () => {
        let dad;
        let mum;
        let expKitty;
        let kittyOwner
        beforeEach(async () => {
            kittyOwner = accounts[1];
            dad = {
                kittyId: new BN('1'),
                mumId: new BN('0'),
                dadId: new BN('0'),
                generation: new BN('0'),
                genes: new BN('1112131415161718'),
                owner: kittyOwner,
            };
            mum = {
                kittyId: new BN('2'),
                mumId: new BN('0'),
                dadId: new BN('0'),
                generation: new BN('0'),
                genes: new BN('2122232425262728'),
                owner: kittyOwner,
            };
            expKitty = {
                kittyId: new BN('3'),
                mumId: new BN('2'),
                dadId: new BN('1'),
                generation: new BN('1'),
                genes: new BN('1112131425262728'),
                owner: kittyOwner,
            }
        });

        async function createParents() {
            await createKitty(dad);
            await createKitty(mum);
        }

        it('should create a new kitty assigned to the sender', async () => {
            await createParents();

            await kittyFactory
                .breed(dad.kittyId, mum.kittyId, { from: kittyOwner });

            const actualKitty = await kittyFactory.getKitty(expKitty.kittyId);

            expect(actualKitty.kittyId.toString(10)).to.equal(expKitty.kittyId.toString(10));
            expect(actualKitty.mumId.toString(10)).to.equal(expKitty.mumId.toString(10));
            expect(actualKitty.dadId.toString(10)).to.equal(expKitty.dadId.toString(10));
            expect(actualKitty.generation.toString(10)).to.equal(expKitty.generation.toString(10));

            const actualOwner = await kittyFactory.ownerOf(expKitty.kittyId);
            expect(actualOwner).to.equal(expKitty.owner);
        });

        it('should REVERT if the sender does not own the dad kitty', async () => {
            dad.owner = accounts[3];
            await createParents();

            await truffleAssert.reverts(
                kittyFactory
                    .breed(dad.kittyId, mum.kittyId, { from: kittyOwner })
            );
        });

        it('should REVERT if the sender does not own the mum kitty', async () => {
            mum.owner = accounts[3];
            await createParents();

            await truffleAssert.reverts(
                kittyFactory
                    .breed(dad.kittyId, mum.kittyId, { from: kittyOwner })
            );
        });

        describe('generation number', () => {

            [
                { name: 'same gen', mumGen: 0, dadGen: 0, kittyGen: 1 },
                { name: 'mum younger', mumGen: 1, dadGen: 0, kittyGen: 2 },
                { name: 'dad younger', mumGen: 1, dadGen: 3, kittyGen: 4 },
            ].forEach(testCase => {
                it(`should always be 1 higher than max of parents. Case: ${testCase.name} mum gen: ${testCase.mumGen} dad gen: ${testCase.dadGen}`, async () => {
                    mum.generation = testCase.mumGen;
                    dad.generation = testCase.dadGen;
                    await createParents();

                    await kittyFactory
                        .breed(dad.kittyId, mum.kittyId, { from: kittyOwner });

                    const actualKitty = await kittyFactory.getKitty(expKitty.kittyId);
                    expect(actualKitty.generation.toString(10)).to.equal(testCase.kittyGen.toString());
                });
            });
        });
    });    
});