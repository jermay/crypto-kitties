pragma solidity ^0.5.12;

import "./Ownable.sol";
import "./KittyFactory.sol";
import "./IKittyMarketplace.sol";

contract KittyMarketPlace is Ownable, IKittyMarketPlace {
    KittyFactory internal _kittyContract;

    struct Offer {
        address payable seller;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
    }

    Offer[] offers;
    mapping(uint256 => Offer) tokenIdToOffer;

    modifier onlyTokenOwner(uint256 _tokenId) {
        require(
            msg.sender == _kittyContract.ownerOf(_tokenId),
            "not token owner"
        );
        _;
    }

    modifier activeOffer(uint256 _tokenId) {
        require(hasActiveOffer(_tokenId), "offer not active");
        _;
    }

    function hasActiveOffer(uint256 _tokenId) public view returns (bool) {
        return tokenIdToOffer[_tokenId].active;
    }

    /**
     * Set the current KittyContract address and initialize the instance of Kittycontract.
     * Requirement: Only the contract owner can call.
     */
    function setKittyContract(address _kittyContractAddress)
        external
        onlyOwner
    {
        _kittyContract = KittyFactory(_kittyContractAddress);
    }

    /**
     * Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
     */
    function getOffer(uint256 _tokenId)
        external
        view
        activeOffer(_tokenId)
        returns (
            address seller,
            uint256 price,
            uint256 index,
            uint256 tokenId,
            bool active
        )
    {
        Offer storage offer = tokenIdToOffer[_tokenId];
        seller = offer.seller;
        price = offer.price;
        index = offer.index;
        tokenId = offer.tokenId;
        active = offer.active;
    }

    /**
     * Get all tokenId's that are currently for sale. Returns an empty arror if none exist.
     */
    function getAllTokenOnSale()
        external
        view
        returns (uint256[] memory listOfOffers)
    {
        // count the number of active orders
        uint256 count = 0;
        for (uint256 i = 0; i < offers.length; i++) {
            Offer storage offer = offers[i];
            if (offer.active) {
                count++;
            }
        }

        // create an array of active orders
        listOfOffers = new uint256[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < offers.length; i++) {
            Offer storage offer = offers[i];
            if (offer.active) {
                listOfOffers[j] = offer.tokenId;
                j++;
            }
            if (j >= count) {
                return listOfOffers;        
            }
        }

        return listOfOffers;
    }

    /**
     * Creates a new offer for _tokenId for the price _price.
     * Emits the MarketTransaction event with txType "Create offer"
     * Requirement: Only the owner of _tokenId can create an offer.
     * Requirement: There can only be one active offer for a token at a time.
     * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
     */
    function setOffer(uint256 _price, uint256 _tokenId)
        external
        onlyTokenOwner(_tokenId)
    {
        require(
            _kittyContract.isApprovedForAll(msg.sender, address(this)),
            "market must be approved operator"
        );
        require(!hasActiveOffer(_tokenId), "duplicate offer");

        Offer memory newOffer = Offer(msg.sender, _price, 0, _tokenId, true);
        uint256 index = offers.push(newOffer) - 1;
        offers[index].index = index;

        tokenIdToOffer[_tokenId] = offers[index];

        emit MarketTransaction("Create", msg.sender, _tokenId);
    }

    /**
     * Removes an existing offer.
     * Emits the MarketTransaction event with txType "Remove offer"
     * Requirement: Only the seller of _tokenId can remove an offer.
     */
    function removeOffer(uint256 _tokenId)
        external
        onlyTokenOwner(_tokenId)
        activeOffer(_tokenId)
    {
        _setOfferInactive(_tokenId);

        emit MarketTransaction("Remove", msg.sender, _tokenId);
    }

    function _setOfferInactive(uint256 _tokenId) internal {
        Offer storage offer = tokenIdToOffer[_tokenId];
        offer.active = false;
    }

    /**
     * Executes the purchase of _tokenId.
     * Sends the funds to the seller and transfers the token using transferFrom in Kittycontract.
     * Emits the MarketTransaction event with txType "Buy".
     * Requirement: The msg.value needs to equal the price of _tokenId
     * Requirement: There must be an active offer for _tokenId
     */
    function buyKitty(uint256 _tokenId) external payable activeOffer(_tokenId) {
        Offer storage offer = tokenIdToOffer[_tokenId];
        require(msg.value == offer.price, "payment must be exact");

        // tansfer funds from buyer to seller
        offer.seller.transfer(msg.value);

        // tranfer kitty ownership
        _kittyContract.safeTransferFrom(offer.seller, msg.sender, _tokenId);

        _setOfferInactive(_tokenId);

        // emit event
        emit MarketTransaction("Buy", msg.sender, _tokenId);
    }
}