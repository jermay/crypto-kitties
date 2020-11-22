/* eslint-env node, mocha */
const { expect, } = require('chai');
const truffleAssert = require('truffle-assertions');
const { zeroAddress, } = require('./kittyUtils');

const KittyAdmin = artifacts.require('KittyAdmin');
const KittyAdminTest = artifacts.require('KittyAdminTest');

contract('KittyAdmin', (accounts) => {
  let contractOwner;
  let contractInstance;
  let testCreator;
  const startingIndex = 2;

  beforeEach(async () => {
    contractOwner = accounts[0];
    testCreator = accounts[1];

    contractInstance = await KittyAdminTest.new();
  });

  describe('init', () => {
    it('should be created', async () => {
      const instance = await KittyAdmin.new();
      // eslint-disable-next-line no-unused-expressions
      expect(instance).to.exist;
    });

    it('should add the zero address at index zero as a placeholder so valid indexes start at 1', async () => {
      const result = await contractInstance.test_getKittyCreatorFromArray(0);
      expect(result).to.equal(zeroAddress);
    });

    it.only('should add the contract owner at index 1', async () => {
      const result = await contractInstance.test_getKittyCreatorFromArray(1);
      expect(result).to.equal(contractOwner);

      const mappingResult = await contractInstance.test_getKittyCreatorFromMapping(contractOwner);
      expect(mappingResult.toString(10)).to.equal('1');
    });
  });

  describe('addKittyCreator', () => {
    it('should add a new address', async () => {
      await contractInstance.addKittyCreator(
        testCreator, { from: contractOwner, }
      );

      const resultAddress = await contractInstance
        .test_getKittyCreatorFromArray(startingIndex);
      const resultId = await contractInstance
        .test_getKittyCreatorFromMapping(testCreator);

      expect(resultId.toString(10)).to.equal(startingIndex.toString(), 'add to mapping');
      expect(resultAddress).to.equal(testCreator, 'add to array');
    });

    it('should REVERT if the sender is not the Owner', async () => {
      await truffleAssert.reverts(
        contractInstance.addKittyCreator(
          testCreator, { from: accounts[2], }
        ),
        'only owner'
      );
    });

    it('should emit a KittyCreatorAdded event', async () => {
      const result = await contractInstance.addKittyCreator(
        testCreator, { from: contractOwner, }
      );

      truffleAssert.eventEmitted(
        result,
        'KittyCreatorAdded',
        (event) => event.creator === testCreator
      );
    });

    it('should REVERT if address is the contract address', async () => {
      await truffleAssert.reverts(
        contractInstance.addKittyCreator(
          contractInstance.address, { from: contractOwner, }
        ),
        'contract address'
      );
    });

    it('should REVERT if the address is the zero address', async () => {
      await truffleAssert.reverts(
        contractInstance.addKittyCreator(
          zeroAddress, { from: contractOwner, }
        ),
        'zero address'
      );
    });
  });

  describe('removeKittyCreator', () => {
    beforeEach(async () => {
      await contractInstance.addKittyCreator(testCreator);
    });

    it('should remove the address from the mapping', async () => {
      await contractInstance.removeKittyCreator(testCreator);

      const result = await contractInstance.test_getKittyCreatorFromMapping(testCreator);
      expect(result.toString(10)).to.equal('0');
    });

    it('should remove the address from the array', async () => {
      await contractInstance.removeKittyCreator(testCreator);

      const result = await contractInstance.test_getKittyCreatorFromArray(startingIndex);
      expect(result).to.equal(zeroAddress);
    });

    it('should emit a KittyCreatorRemoved event', async () => {
      const trans = await contractInstance.removeKittyCreator(testCreator);

      truffleAssert.eventEmitted(
        trans,
        'KittyCreatorRemoved',
        (event) => event.creator === testCreator
      );
    });

    it('should REVERT if the sender is not the owner', async () => {
      await truffleAssert.reverts(
        contractInstance.removeKittyCreator(testCreator, { from: accounts[2], }),
        'not owner'
      );
    });
  });

  describe('getKittyCreators', () => {
    let testCreators;
    beforeEach(async () => {
      // add some creators
      testCreators = [
        accounts[1],
        accounts[7], // will be removed
        accounts[5],
      ];
      testCreators.forEach(async (creator) => {
        await contractInstance.addKittyCreator(creator);
      });
      await contractInstance.removeKittyCreator(testCreators[1]);
    });

    it('should return the addresses of all the kitty creators', async () => {
      const result = await contractInstance.getKittyCreators();

      // length will include the placeholder and the owner
      // which are added by default
      expect(result.length).to.equal(testCreators.length + 2, 'length');

      expect(result[0]).to.equal(zeroAddress, 'placeholder');
      expect(result[1]).to.equal(contractOwner, 'owner');
      expect(result[2]).to.equal(testCreators[0], 'index 1');
      expect(result[3]).to.equal(zeroAddress, 'removed');
      expect(result[4]).to.equal(testCreators[2], 'index 3');
    });
  });

  describe('onlyKittyOwner', () => {
    it('should succeed if the sender is a kitty creator', async () => {
      await contractInstance.addKittyCreator(testCreator);

      await truffleAssert.passes(
        contractInstance.testOnlyKittyCreatorModifier({ from: testCreator, })
      );
    });

    it('should revert if the sender is NOT a kitty creator', async () => {
      await truffleAssert.reverts(
        contractInstance.testOnlyKittyCreatorModifier({ from: accounts[3], }),
        truffleAssert.ErrorType.REVERT,
        'must be a kitty creator'
      );
    });
  });
});
