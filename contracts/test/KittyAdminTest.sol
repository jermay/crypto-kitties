pragma solidity >=0.5.0 <0.6.0;
import "../KittyAdmin.sol";

contract KittyAdminTest is KittyAdmin {
  function test_getKittyCreatorFromArray(uint256 _index) public view returns (address) {
    return kittyCreators[_index];
  }

  function test_getKittyCreatorFromMapping(address _address) public view returns (uint256) {
    return addressToKittyCreatorId[_address];
  }

  function testOnlyKittyCreatorModifier() public view onlyKittyCreator returns (bool) {
    return true;
  }
}
