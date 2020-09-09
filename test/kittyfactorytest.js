var expect = require('chai').expect;
const BN = web3.utils.BN
const truffleAssert = require('truffle-assertions');
const moment = require('moment');

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

    async function addGen0Kitty(dna, _from = contractOwner) {
        return kittyFactory.createKittyGen0(
            dna,
            { from: _from }
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
                cooldownIndex: new BN('0'),
                genes: new BN('1234567812345678'),
                owner: contractOwner,
            }
            transaction = await addGen0Kitty(expKitty.genes);
        });

        it('should store the new kitty', async () => {
            result = await kittyFactory.getKitty(1);
            expect(result.mumId.toString(10)).to.equal(expKitty.mumId.toString(10));
            expect(result.dadId.toString(10)).to.equal(expKitty.dadId.toString(10));
            expect(result.generation.toString(10)).to.equal(expKitty.generation.toString(10));
            expect(result.cooldownIndex.toString(10)).to.equal(expKitty.cooldownIndex.toString(10));
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

        it('should REVERT if gen 0 counter would exceed the gen 0 creation limit', async () => {
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

        it.only('should REVERT if the sender is NOT the owner', async () => {
            await truffleAssert.reverts(
                addGen0Kitty(expKitty.genes, testAccount),
                truffleAssert.ErrorType.REVERT,
                "owner"
            )
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

    describe('Mix DNA', () => {
        let mumDna;
        let dadDna
        let masterSeed;
        const geneSizes = [2, 2, 2, 2, 1, 1, 2, 2, 1, 1];
        const randomDnaThreshold = 7;
        let expDna;
        beforeEach(() => {
            mumDna = '1122334456778890';
            dadDna = '9988776604332215';
            masterSeed = 1705; // % 1023 = 10 1010 1010 in binary
            // if the dnaSeed is 1 choose Dad gene, if 0 Mom gene
            // if the randomSeed digit is higher then the RANDOM_DNA_THRESHOLD
            // choose the random value instead of a parent gene
            // randomSeed:    8  3  8  2 3 5  4  3 9 8
            // randomValues: 62 77 47 79 1 3 48 49 2 8
            //                *     *              * *

            expDna = new BN('6222474406338828');
        });

        it('should mix the DNA according to the mask and seed', async () => {
            const result = await kittyFactory.mixDna(dadDna, mumDna, masterSeed);

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
                cooldownIndex: new BN('0'),
                genes: new BN('1112131415161718'),
                owner: kittyOwner,
            };
            mum = {
                kittyId: new BN('2'),
                mumId: new BN('0'),
                dadId: new BN('0'),
                generation: new BN('0'),
                cooldownIndex: new BN('0'),
                genes: new BN('2122232425262728'),
                owner: kittyOwner,
            };
            expKitty = {
                kittyId: new BN('3'),
                mumId: new BN('2'),
                dadId: new BN('1'),
                generation: new BN('1'),
                cooldownIndex: new BN('0'),
                genes: new BN('1112131425262728'),
                owner: kittyOwner,
            }
        });

        async function createParents() {
            await createKitty(dad);
            await createKitty(mum);
        }

        async function createGenXParents(parentGen) {
            dad.generation = parentGen;
            mum.generation = parentGen;
            await createParents();
        }

        async function breedParents() {
            return kittyFactory
                .breed(dad.kittyId, mum.kittyId, { from: kittyOwner });
        }

        async function breedGenXParents(parentGen) {
            await createGenXParents(parentGen);
            return breedParents();
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
            expect(actualKitty.cooldownIndex.toString(10)).to.equal(expKitty.cooldownIndex.toString(10));

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

        describe('ready to breed', () => {
            it('should return TRUE if the cooldown end time is has passed', async () => {
                await createKitty(dad);

                const result = await kittyFactory.readyToBreed(dad.kittyId);

                expect(result).to.equal(true);
            });

            it('should return FALSE if cooldown time has NOT yet passed', async () => {
                await createKitty(dad);
                await kittyFactory.test_setKittyCooldownEnd(
                    dad.kittyId,
                    moment().add(1, 'hour').unix()
                );

                const result = await kittyFactory.readyToBreed(dad.kittyId);

                expect(result).to.equal(false);
            });
        });

        describe('kitten', () => {

            describe('cooldownIndex', () => {

                [
                    { name: 'same as parent', parentGen: 2, kittyCooldownIndex: 1 },
                    { name: 'higher than parent', parentGen: 3, kittyCooldownIndex: 2 },
                    { name: 'cap above gen26', parentGen: 27, kittyCooldownIndex: 13 },
                ].forEach(testCase => {
                    it(`should be half the generation number rounded down. Case: ${testCase.name}, parentGen: ${testCase.parentGen}`, async () => {
                        expKitty.cooldownIndex = testCase.kittyCooldownIndex;
                        await breedGenXParents(testCase.parentGen);

                        const actualKitty = await kittyFactory.getKitty(expKitty.kittyId);
                        expect(actualKitty.cooldownIndex.toString(10)).to.equal(expKitty.cooldownIndex.toString(10));
                    });
                });
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

        describe('parents', () => {

            describe('cooldown end time', () => {
                const cooldowns = [
                    moment.duration(1, 'minute'),   // 0
                    moment.duration(2, 'minutes'),  // 1
                    moment.duration(5, 'minutes'),  // 2
                    moment.duration(10, 'minutes'), // 3
                    moment.duration(30, 'minutes'), // 4
                    moment.duration(1, 'hour'),     // 5
                    moment.duration(2, 'hours'),    // 6
                    moment.duration(4, 'hours'),    // 7
                    moment.duration(8, 'hours'),    // 8
                    moment.duration(16, 'hours'),   // 9
                    moment.duration(1, 'day'),      // 10
                    moment.duration(2, 'days'),     // 11
                    moment.duration(4, 'days'),     // 12
                    moment.duration(7, 'days'),     // 13
                ];

                async function getExpCooldownEndTime(cooldownIndex) {
                    const cooldown = cooldowns[cooldownIndex];
                    const now = await kittyFactory.getNow();
                    const endMoment = moment.unix(now)
                        .add(cooldown);
                    return {
                        start: now,
                        cooldown: cooldown.as('seconds'),
                        end: endMoment.unix()
                    };
                }

                async function expectCoolDownTime(kittyId, cooldownIndex) {
                    const expTime = await getExpCooldownEndTime(cooldownIndex);
                    const parent = await kittyFactory.getKitty(kittyId);
                    expect(parent.cooldownEndTime.toString(10)).to.equal(expTime.end.toString());
                }

                [
                    { name: '1 minute', parentGen: 0, cooldownIndex: 0 },
                    { name: '1 hour', parentGen: 10, cooldownIndex: 5 },
                    { name: '1 day', parentGen: 20, cooldownIndex: 10 },
                    { name: '7 day (max)', parentGen: 26, cooldownIndex: 13 },
                ].forEach(testCase => {
                    it(`when parent generation is ${testCase.parentGen}
                    their cooldown should be "now" plus ${testCase.name}`, async () => {
                        await breedGenXParents(testCase.parentGen);

                        await expectCoolDownTime(dad.kittyId, testCase.cooldownIndex);
                        await expectCoolDownTime(mum.kittyId, testCase.cooldownIndex);
                    });
                })
            });

            describe('cooldown index', () => {

                async function expectCooldownIndex(expIndex) {
                    [mum.kittyId, dad.kittyId].forEach(async kittyId => {
                        const kitty = await kittyFactory.getKitty(kittyId);
                        expect(kitty.cooldownIndex.toString(10)).to.equal(expIndex.toString());
                    });
                }

                [
                    { name: 'under cap', parentGen: 2, expIndex: 2 },
                    { name: 'before cap', parentGen: 24, expIndex: 13 },
                    { name: 'at cap', parentGen: 26, expIndex: 13 }
                ].forEach(testCase => {
                    it(`should increment the cooldown index except when at the cap. Case: ${testCase.name}, parentGen: ${testCase.parentGen}`, async () => {
                        await breedGenXParents(testCase.parentGen);

                        await expectCooldownIndex(testCase.expIndex);
                    });
                });

            });

            [
                { name: 'mum' },
                { name: 'dad' }
            ].forEach(testCase => {
                it(`should REVERT if the ${testCase.name} is on cooldown`, async () => {
                    const kittyId = testCase.name === 'mum' ?
                        mum.kittyId : dad.kittyId;
                    await createGenXParents(9);
                    await kittyFactory.test_setKittyCooldownEnd(
                        kittyId,
                        moment().add(1, 'hour').unix()
                    );

                    await truffleAssert.fails(
                        breedParents(),
                        truffleAssert.ErrorType.REVERT,
                        'cooldown'
                    );
                });
            });
        });
    });
});