pragma solidity >=0.5.0 <0.6.0;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./KittyContract.sol";

contract KittyFactory is Ownable, KittyContract {
    using SafeMath32 for uint32;

    event Birth(uint256 kittyId, string name, string dna, uint32 generation);

    // struct Kitty {
    //     string name;
    //     string dna;
    //     uint32 generation;
    // }

    // Kitty[] public kitties;

    // mapping (uint256 => address) public kittyToOwner;
    // mapping (address => uint) public ownerKittyCount;

    function birth(string memory _name, string memory _dna) public {
        Kitty memory kitty = Kitty(_name, _dna, 0);
        uint256 kittyId = kitties.push(kitty) - 1;
        kittyToOwner[kittyId] = msg.sender;
        ownerKittyCount[msg.sender] = ownerKittyCount[msg.sender].add(1);
        emit Birth(kittyId, _name, _dna, 0);
    }
}
