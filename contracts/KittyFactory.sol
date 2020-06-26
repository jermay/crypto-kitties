pragma solidity >=0.5.0 <0.6.0;

import "./Ownable.sol";
import "./SafeMath.sol";

contract KittyFactory is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event Birth(uint256 kittyId, string name, string dna);

    struct Kitty {
        string name;
        string dna;
    }

    Kitty[] public kitties;

    mapping (uint256 => address) public kittyToOwner;
    mapping (address => uint) public ownerKittyCount;

    constructor() public {
        kitties.push(Kitty({
            name: 'unKitty',
            dna: ''
        }));
    }

    function birth(string memory _name, string memory _dna) public {
        Kitty memory kitty = Kitty(_name, _dna);
        uint256 kittyId = kitties.push(kitty) - 1;
        kittyToOwner[kittyId] = msg.sender;
        ownerKittyCount[msg.sender] = ownerKittyCount[msg.sender].add(1);
        emit Birth(kittyId, _name, _dna);
    }
}