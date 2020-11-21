/* eslint-env node, mocha */
const { expect, } = require('chai');
const truffleAssert = require('truffle-assertions');
const { zeroAddress, } = require('./kittyUtils');

const { BN, } = web3.utils;
const TestKittyContract = artifacts.require('TestKittyContract');
const TestERC721Receiver = artifacts.require('TestERC721Receiver');
const TestBadNFTReceiver = artifacts.require('TestBadNFTReceiver');


contract('KittyContract', (accounts) => {
  let contract;
  let kittyOwner;
  let kitty;
  let newOwner;
  beforeEach(async () => {
    kittyOwner = accounts[1];
    newOwner = accounts[2];
    kitty = {
      kittyId: new BN('1'),
      mumId: new BN('2'),
      dadId: new BN('3'),
      generation: new BN('4'),
      genes: new BN('1234567812345678'),
      cooldownIndex: new BN('2'),
      owner: kittyOwner,
    };
    contract = await TestKittyContract.new();
  });

  function getEventFromResult(result, eventName) {
    const event = result.logs.find((log) => log.event === eventName);
    return event.args;
  }

  function addKitty(cat) {
    return contract.addKitty(
      cat.mumId,
      cat.dadId,
      cat.generation,
      cat.genes,
      cat.cooldownIndex,
      cat.owner
    );
  }

  function addApproval(cat, approved) {
    return contract.approve(
      approved,
      cat.kittyId,
      { from: cat.owner, }
    );
  }

  async function addKittyAndApproval(cat, approved) {
    await addKitty(cat);
    const result = await addApproval(cat, approved);
    return result;
  }

  // function addOperator(kitty, operator) {
  //     // grant operator approval
  //     return contract.setApprovalForAll(
  //         operator, true, { from: kitty.owner });
  // }

  describe('init', () => {
    it('should be created with the un-kitty so valid kitties have an id > 0', async () => {
      const unKitty = {
        kittyId: new BN('0'),
        birthTime: new BN('0'),
        cooldownEndTime: new BN('0'),
        mumId: new BN('0'),
        dadId: new BN('0'),
        generation: new BN('0'),
        cooldownIndex: new BN('0'),
        genes: new BN('0'),
        owner: zeroAddress,
      };
      const result = await contract.getKitty(0);
      expect(result.kittyId.toString(10)).to.equal(unKitty.kittyId.toString(10));
      expect(result.birthTime.toString(10)).to.equal(unKitty.birthTime.toString(10));
      expect(result.cooldownEndTime.toString(10)).to.equal(unKitty.cooldownEndTime.toString(10));
      expect(result.mumId.toString(10)).to.equal(unKitty.mumId.toString(10));
      expect(result.mumId.toString(10)).to.equal(unKitty.mumId.toString(10));
      expect(result.dadId.toString(10)).to.equal(unKitty.dadId.toString(10));
      expect(result.generation.toString(10), 'generation').to.equal(unKitty.generation.toString(10));
      expect(result.cooldownIndex.toString(10), 'generation').to.equal(unKitty.cooldownIndex.toString(10));
      expect(result.genes.toString(10)).to.equal(unKitty.genes.toString(10));
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
      await addKitty(kitty);

      const result = await contract.ownerOf(kitty.kittyId);
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
    const expected = 'Kitty Token';
    const actual = await contract.name();
    expect(actual).to.equal(expected);
  });

  it('symbol should return the contract symbol', async () => {
    const expected = 'CAT';
    const actual = await contract.symbol();
    expect(actual).to.equal(expected);
  });

  describe('transfer', () => {
    beforeEach(async () => {
      await addKitty(kitty);
    });

    it('should change the ownership of the kitty to the new address', async () => {
      await contract.transfer(newOwner, kitty.kittyId, { from: kittyOwner, });

      const actualNewOwner = await contract.ownerOf(kitty.kittyId);
      expect(actualNewOwner).to.equal(newOwner, 'owner');

      const oldOwnerCount = await contract.balanceOf(kittyOwner);
      expect(oldOwnerCount.toString(10)).to.equal('0', 'old owner count');

      const newOwnerCount = await contract.balanceOf(newOwner);
      expect(newOwnerCount.toString(10)).to.equal('1');
    });

    it('should emit a Transfer event', async () => {
      const result = await contract.transfer(
        newOwner, kitty.kittyId, { from: kittyOwner, }
      );
      truffleAssert.eventEmitted(
        result, 'Transfer'
      );
    });

    it('should REVERT if the sender does NOT own the kitty and is NOT approved', async () => {
      await truffleAssert.fails(
        contract.transfer(newOwner, kitty.kittyId, { from: newOwner, }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('should NOT revert if the sender is NOT the owner but IS approved', async () => {
      const approvedAddress = accounts[3];
      addApproval(kitty, approvedAddress);

      await truffleAssert.passes(
        contract.transfer(
          approvedAddress,
          kitty.kittyId,
          { from: approvedAddress, }
        )
      );
    });

    it('should NOT revert if the send is NOT the owner but IS an approved operator', async () => {
      // grant operator approval
      const operator = accounts[4];
      await contract.setApprovalForAll(
        operator, true, { from: kittyOwner, }
      );

      await truffleAssert.passes(
        contract.transfer(
          operator,
          kitty.kittyId,
          { from: operator, }
        )
      );
    });

    it('should REVERT if the "to" address is zero', async () => {
      await truffleAssert.fails(
        contract.transfer(zeroAddress, kitty.kittyId, { from: kittyOwner, }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('should REVERT if the "to" address is the contract address', async () => {
      const contractAddress = contract.address;
      await truffleAssert.fails(
        contract.transfer(contractAddress, kitty.kittyId, { from: kittyOwner, }),
        truffleAssert.ErrorType.REVERT
      );
    });
  });

  describe('approve', () => {
    let approvedAddr;
    beforeEach(async () => {
      await addKitty(kitty);
      approvedAddr = newOwner;
    });

    it('should set an approval for the given address', async () => {
      await contract.approve(
        approvedAddr,
        kitty.kittyId,
        { from: kitty.owner, }
      );

      const result = await contract.kittyToApproved(kitty.kittyId);
      expect(result.toString(10)).to.equal(approvedAddr);
    });

    it('should emit an Approval event', async () => {
      const result = await contract.approve(
        approvedAddr,
        kitty.kittyId,
        { from: kitty.owner, }
      );

      truffleAssert.eventEmitted(result, 'Approval');

      const event = result.logs[0].args;
      expect(event.owner).to.equal(kitty.owner);
      expect(event.approved).to.equal(approvedAddr);
      expect(event.tokenId.toString(10)).to.equal(kitty.kittyId.toString(10));
    });

    it('should REVERT if the sender is not the owner or approved', async () => {
      const bogusAddress = accounts[3];

      await truffleAssert.fails(
        contract.approve(bogusAddress, kitty.kittyId, { from: bogusAddress, }),
        truffleAssert.ErrorType.REVERT
      );
    });

    // is this desired behaviour?
    it('should NOT revert if the sender is NOT the owner but IS approved', async () => {
      const anotherAddress = accounts[3];
      await contract.approve(
        approvedAddr,
        kitty.kittyId,
        { from: kitty.owner, }
      );

      await truffleAssert.passes(
        contract.approve(anotherAddress, kitty.kittyId, { from: approvedAddr, })
      );
    });

    it('should NOT revert if the sender is NOT the owner but is an approved operator', async () => {
      // grant operator approval
      const operator = accounts[4];
      await contract.setApprovalForAll(
        operator, true, { from: kittyOwner, }
      );

      await truffleAssert.passes(
        contract.approve(operator, kitty.kittyId, { from: operator, })
      );
    });
  });

  describe('Get Approved', () => {
    let approved;
    beforeEach(() => {
      approved = accounts[2];
    });

    it('when set, it should return the approved address', async () => {
      await addKittyAndApproval(kitty, approved);

      const result = await contract.getApproved(kitty.kittyId);
      expect(result).to.equal(approved);
    });

    it('should return the zero address when no approval has been set', async () => {
      // add kitty but don't set an approval
      await addKitty(kitty);

      const result = await contract.getApproved(kitty.kittyId);
      expect(result).to.equal(zeroAddress);
    });

    it('should REVERT if tokenId is NOT valid', async () => {
      const invalidTokenId = 1234;

      await truffleAssert.fails(
        contract.getApproved(invalidTokenId),
        truffleAssert.ErrorType.REVERT
      );
    });
  });

  describe('Operator approval for all', () => {
    it('should set and revoke operator approval for an address', async () => {
      // grant operator approval
      const operator = accounts[4];
      await contract.setApprovalForAll(
        operator, true, { from: kittyOwner, }
      );

      const result = await contract
        .isApprovedForAll(kittyOwner, operator);

      expect(result).to.equal(true);

      // revoke operator approval
      await contract.setApprovalForAll(
        operator, false, { from: kittyOwner, }
      );

      const result2 = await contract
        .isApprovedForAll(kittyOwner, operator);

      expect(result2).to.equal(false);
    });

    it('should support setting multiple operator approvals per address', async () => {
      // approve first operator
      const operator1 = accounts[4];
      await contract.setApprovalForAll(
        operator1, true, { from: kittyOwner, }
      );

      const result = await contract
        .isApprovedForAll(kittyOwner, operator1);

      expect(result).to.equal(true);

      // approve second operator
      const operator2 = accounts[5];
      await contract.setApprovalForAll(
        operator2, true, { from: kittyOwner, }
      );

      const result2 = await contract
        .isApprovedForAll(kittyOwner, operator1);

      expect(result2).to.equal(true);
    });

    it('should emit an ApprovalForAll event', async () => {
      const eventName = 'ApprovalForAll';
      const operator1 = accounts[4];
      const result = await contract.setApprovalForAll(
        operator1, true, { from: kittyOwner, }
      );

      const event = getEventFromResult(result, eventName);
      truffleAssert.eventEmitted(result, eventName);
      expect(event.owner).to.equal(kittyOwner);
      expect(event.operator).to.equal(operator1);
      expect(event.approved).to.equal(true);
    });
  });

  describe('transferFrom', () => {
    beforeEach(async () => {
      await addKitty(kitty);
    });

    it('when the sender is the owner it should transfer ownership', async () => {
      await contract.transferFrom(
        kitty.owner,
        newOwner,
        kitty.kittyId,
        { from: kitty.owner, }
      );

      const result = await contract.ownerOf(kitty.kittyId);
      expect(result).to.equal(newOwner);
    });

    it('when the sender is approved it should transfer ownership', async () => {
      const approved = accounts[2];
      await addApproval(kitty, approved);

      await truffleAssert.passes(
        contract.transferFrom(
          kitty.owner,
          approved,
          kitty.kittyId,
          { from: approved, }
        )
      );
    });

    it('when the sender is an approved operator it should transfer ownership', async () => {
      const operator1 = accounts[4];
      await contract.setApprovalForAll(
        operator1, true, { from: kittyOwner, }
      );

      await truffleAssert.passes(
        contract.transferFrom(
          kitty.owner,
          operator1,
          kitty.kittyId,
          { from: operator1, }
        )
      );
    });

    it('should REVERT when the sender is not the owner, approved, or an approved operator', async () => {
      const unapproved = accounts[3];

      await truffleAssert.reverts(
        contract.transferFrom(
          kitty.owner,
          unapproved,
          kitty.kittyId,
          { from: unapproved, }
        )
      );
    });

    it('should REVERT if from address is not the owner', async () => {
      await truffleAssert.reverts(
        contract.transferFrom(
          newOwner,
          newOwner,
          kitty.kittyId,
          { from: kittyOwner, }
        )
      );
    });

    it('should REVERT if to address is the zero address', async () => {
      await truffleAssert.reverts(
        contract.transferFrom(
          kitty.owner,
          zeroAddress,
          kitty.kittyId,
          { from: kittyOwner, }
        )
      );
    });

    it('should REVERT if tokenId is not valid', async () => {
      const invalidTokenId = 1234;
      await truffleAssert.reverts(
        contract.transferFrom(
          kitty.owner,
          newOwner,
          invalidTokenId,
          { from: kittyOwner, }
        )
      );
    });
  });

  describe('safeTransferFrom', () => {
    beforeEach(async () => {
      await addKitty(kitty);
    });

    it('should transfer ownership when the sender is the owner', async () => {
      await contract.safeTransferFrom(
        kitty.owner,
        newOwner,
        kitty.kittyId,
        { from: kitty.owner, }
      );

      const result = await contract.ownerOf(kitty.kittyId);
      expect(result).to.equal(newOwner);
    });

    it('should transfer when the sender is NOT the owner but IS approved', async () => {
      const approved = accounts[3];
      await addApproval(kitty, approved);

      await contract.safeTransferFrom(
        kitty.owner,
        approved,
        kitty.kittyId,
        { from: approved, }
      );

      const result = await contract.ownerOf(kitty.kittyId);
      expect(result).to.equal(approved);
    });

    it('should REVERT when the sender is NOT the owner and NOT approved', async () => {
      const unApproved = accounts[3];

      await truffleAssert.reverts(
        contract.safeTransferFrom(
          kitty.owner,
          unApproved,
          kitty.kittyId,
          { from: unApproved, }
        )
      );
    });

    it('should REVERT if the from address is not the owner', async () => {
      await truffleAssert.reverts(
        contract.safeTransferFrom(
          newOwner,
          newOwner,
          kitty.kittyId,
          { from: kitty.owner, }
        )
      );
    });

    it('should REVERT if the to address is the zero address', async () => {
      await truffleAssert.reverts(
        contract.safeTransferFrom(
          kitty.owner,
          zeroAddress,
          kitty.kittyId,
          { from: kitty.owner, }
        )
      );
    });

    it('should transfer the when the recieiver is an ERC721 contract', async () => {
      const erc721Receiver = await TestERC721Receiver.new();

      await contract.safeTransferFrom(
        kitty.owner,
        erc721Receiver.address,
        kitty.kittyId,
        { from: kitty.owner, }
      );
    });

    it('should REVERT when the reciever contract is NOT ERC721 compliant', async () => {
      const uncompliantContract = await TestBadNFTReceiver.new();

      await truffleAssert.reverts(
        contract.safeTransferFrom(
          kitty.owner,
          uncompliantContract.address,
          kitty.kittyId,
          { from: kitty.owner, }
        )
      );
    });
  });

  describe('supports interface', () => {
    const ERC165_ID = '0x01ffc9a7';
    const ERC721_ID = '0x80ac58cd';

    it('should return TRUE for ERC165', async () => {
      const result = await contract.supportsInterface(ERC165_ID);

      expect(result).to.equal(true);
    });

    it('should return TRUE for ERC721', async () => {
      const result = await contract.supportsInterface(ERC721_ID);

      expect(result).to.equal(true);
    });
  });
});
