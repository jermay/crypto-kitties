pragma solidity ^0.5.12;
import "../KittyMarketPlace.sol";

contract TestKittyMarketPlace is KittyMarketPlace {
    constructor(address _kittyContractAddress)
        public
        KittyMarketPlace(_kittyContractAddress)
    {}

    function getKittyContractAddress() public view returns (address addr) {
        return address(_kittyContract);
    }

    function test_createOffer(
        address payable _seller,
        uint256 _price,
        uint256 _tokenId,
        bool _isSireOffer,
        bool _active
    ) public {
        Offer memory newOffer = Offer(
            _seller,
            _price,
            0,
            _tokenId,
            _isSireOffer,
            _active
        );
        uint256 index = offers.push(newOffer) - 1;
        offers[index].index = index;

        tokenIdToOffer[_tokenId] = offers[index];
    }
}
