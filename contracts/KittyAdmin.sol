pragma solidity >=0.5.0 <0.6.0;
import "./Ownable.sol";

contract KittyAdmin is Ownable {
    mapping(address => uint256) addressToKittyCreatorId;
    address[] kittyCreators;

    event KittyCreatorAdded(address creator);
    event KittyCreatorRemoved(address creator);

    constructor() public {
        // placeholder to reserve ID zero as an invalid value
        kittyCreators.push(address(0));

        // the owner should be allowed to create kitties
        kittyCreators.push(owner());
    }

    modifier onlyKittyCreator() {
        require(isKittyCreator(msg.sender), "must be a kitty creator");
        _;
    }

    function isKittyCreator(address _address) public view returns (bool) {
        return addressToKittyCreatorId[_address] != 0;
    }

    function addKittyCreator(address _address) external onlyOwner {
        addressToKittyCreatorId[_address] = kittyCreators.length;
        kittyCreators.push(_address);

        emit KittyCreatorAdded(_address);
    }

    function removeKittyCreator(address _address) external onlyOwner {
        uint256 id = addressToKittyCreatorId[_address];
        delete addressToKittyCreatorId[_address];
        delete kittyCreators[id];

        emit KittyCreatorRemoved(_address);
    }

    function getKittyCreators() external view returns (address[] memory) {
        return kittyCreators;
    }
}
