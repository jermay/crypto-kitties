pragma solidity ^0.5.12;
import "../KittyMarketplace.sol";

contract TestKittyMarketPlace is KittyMarketPlace {
    function getKittyContractAddress() public view returns (address addr) {
        return address(_kittyContract);
    }

    function setOffer(
        address payable _seller,
        uint256 _price,
        uint256 _tokenId,
        bool _active
    ) public {
        Offer memory newOffer = Offer(_seller, _price, 0, _tokenId, _active);
        uint256 index = offers.push(newOffer) - 1;
        offers[index].index = index;

        tokenIdToOffer[_tokenId] = offers[index];
    }
}
