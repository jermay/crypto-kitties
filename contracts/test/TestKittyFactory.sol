pragma solidity ^0.5.12;
import "../KittyFactory.sol";

contract TestKittyFactory is KittyFactory {
    function setKittyToOwner(uint256 _kittyId, address _address) public {
        kittyToOwner[_kittyId] = _address;
    }

    function setOwnerKittyCount(address _address, uint256 _count) public {
        ownerKittyCount[_address] = _count;
    }

    function createKitty(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) public returns (uint256) {
        _createKitty(_mumId, _dadId, _generation, _genes, _owner);
    }

    function test_setGenZeroCounter(uint256 _value) public {
        _gen0Counter = _value;
    }

    function mixDna(uint256 _dadDna, uint256 _mumDna, uint256 _seed)
        public
        pure
        returns (uint256)
    {
        return _mixDna(_dadDna, _mumDna, _seed);
    }

    function getNow() public view returns (uint256) {
        return now;
    }

    function test_setKittyCooldownEnd(uint256 _kittyId, uint64 _unixTimeInSec) public {
        kitties[_kittyId].cooldownEndTime = _unixTimeInSec;
    }
}
