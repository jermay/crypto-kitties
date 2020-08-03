pragma solidity ^0.5.12;
import "../KittyContract.sol";

contract TestKittyContract is KittyContract {
    event Test(uint256 message);

    function setKittyToOwner(uint256 _kittyId, address _address) public {
        kittyToOwner[_kittyId] = _address;
    }

    function setOwnerKittyCount(address _address, uint256 _count) public {
        ownerKittyCount[_address] = _count;
    }

    function addKitty(
        address _owner,
        string memory _name,
        string memory _dna,
        uint16 _generation
    ) public {
        Kitty memory newKitty = Kitty(_name, _dna, _generation);
        uint256 id = kitties.push(newKitty) - 1;
        kittyToOwner[id] = _owner;
        ownerKittyCount[_owner] += 1;
    }
}
