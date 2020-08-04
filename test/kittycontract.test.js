const TestKittyContract = artifacts.require("TestKittyContract");
const BN = web3.utils.BN
const truffleAssert = require('truffle-assertions');

contract('KittyContract', (accounts) => {

    let contract;
    let kittyOwner;
    beforeEach(async () => {
        kittyOwner = accounts[1];
        contract = await TestKittyContract.new();
    });

    describe('init', () => {
        it('should be created with the un-kitty so valid kitties have an id > 0', async () => {
            const unKitty = {
                name: 'unKitty',
                dna: '',
                generation: new BN('0')
            };
            result = await contract.getKitty(0);
            expect(result.name).to.equal(unKitty.name);
            expect(result.dna).to.equal(unKitty.dna);
            expect(result.generation.toString(10)).to.equal(unKitty.generation.toString(10));
        });
    });

    it('balanceOf should return the number of kitties held by an address', async () => {
        const expected = 2;
        await contract.setOwnerKittyCount(kittyOwner, expected);

        const result = await contract.balanceOf(kittyOwner);
        expect(result.toNumber()).to.equal(expected);
    });

    describe('ownerOf', () => {

        it('should return the owner of a kitty', async () => {
            const kittyId = 1;
            const kitty = {
                name: 'test',
                dna: '1234',
                generation: new BN('0')
            }
            await contract.addKitty(kittyOwner, kitty.name, kitty.dna, kitty.generation);

            const result = await contract.ownerOf(kittyId);
            expect(result).to.equal(kittyOwner);
        });

        it('should REVERT if the kittyId does NOT exist', async () => {
            const idDoesNotExist = 123;
            await truffleAssert.fails(
                contract.ownerOf(idDoesNotExist),
                truffleAssert.ErrorType.REVERT
            );
        });
    });

    it('name should return the contract name', async () => {
        const expected = "Kitty Token";
        const actual = await contract.name();
        expect(actual).to.equal(expected);
    });

    it('symbol should return the contract symbol', async () => {
        const expected = "CAT";
        const actual = await contract.symbol();
        expect(actual).to.equal(expected);
    });

    describe('transfer', () => {
        let kittyId;
        let kitty;
        let newOwner;
        beforeEach(async () => {
            newOwner = accounts[2];
            kittyId = 1;
            kitty = {
                name: 'test',
                dna: '1234',
                generation: new BN('0')
            }
            await contract.addKitty(
                kittyOwner, kitty.name, kitty.dna, kitty.generation);
        });

        it('should change the ownership of the kitty to the new address', async () => {
            await contract.transfer(newOwner, kittyId, {from: kittyOwner});

            let actualNewOwner = await contract.ownerOf(kittyId);
            expect(actualNewOwner).to.equal(newOwner, 'owner');

            let oldOwnerCount = await contract.balanceOf(kittyOwner);
            expect(oldOwnerCount.toString(10)).to.equal('0', 'old owner count');

            let newOwnerCount = await contract.balanceOf(newOwner);
            expect(newOwnerCount.toString(10)).to.equal('1');
        });

        it('should emit a Transfer event', async ()=>{
            const result = await contract.transfer(
                newOwner, kittyId, {from: kittyOwner});
            truffleAssert.eventEmitted(
                result, 'Transfer');
                
        });

        it('should REVERT if the sender does NOT own the kitty', async ()=>{
            await truffleAssert.fails(
                contract.transfer(newOwner, kittyId, {from: newOwner}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('should REVERT if the "to" address is zero', async ()=>{
            const zeroAddress = '0x0000000000000000000000000000000000000000';
            await truffleAssert.fails(
                contract.transfer(zeroAddress, kittyId, {from: kittyOwner}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('should REVERT if the "to" address is the contract address', async ()=>{
            const contractAddress = contract.address;
            await truffleAssert.fails(
                contract.transfer(contractAddress, kittyId, {from: kittyOwner}),
                truffleAssert.ErrorType.REVERT
            );
        });
    });
});