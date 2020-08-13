pragma solidity ^0.5.12;
import "./SafeMath.sol";
import "./IERC721.sol";

contract KittyContract is IERC721 {
    using SafeMath for uint256;

    /* struct Kitty {
        string name;
        string dna;
        uint32 generation;
    }*/

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint32 generation;
    }

    Kitty[] internal kitties;
    string _tokenName = "Kitty Token";
    string _tokenSymbol = "CAT";

    mapping(uint256 => address) internal kittyToOwner;
    mapping(address => uint256) internal ownerKittyCount;
    mapping(uint256 => address) public kittyToApproved;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor() public {
        kitties.push(
            Kitty({genes: 0, birthTime: 0, mumId: 0, dadId: 0, generation: 0})
        );
    }

    /**
     * @dev Returns the Kitty for the given kittyId
     */
    function getKitty(uint256 kittyId)
        external
        view
        returns (
            uint256 genes,
            uint64 birthTime,
            uint32 mumId,
            uint32 dadId,
            uint32 generation
        )
    {
        Kitty storage kitty = kitties[kittyId];
        return (
            kitty.genes,
            kitty.birthTime,
            kitty.mumId,
            kitty.dadId,
            kitty.generation
        );
    }

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance) {
        return ownerKittyCount[owner];
    }

    /*
     * @dev Returns the total number of tokens in circulation.
     */
    function totalSupply() external view returns (uint256 total) {
        // is the Unkitty considered part of the supply?
        return kitties.length - 1;
    }

    /*
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory tokenName) {
        return _tokenName;
    }

    /*
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory tokenSymbol) {
        return _tokenSymbol;
    }

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner) {
        require(tokenId <= kitties.length, "invalid kittyId");
        return kittyToOwner[tokenId];
    }

    /* @dev Transfers `tokenId` token from `msg.sender` to `to`.
     *
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `to` can not be the contract address.
     * - `tokenId` token must be owned by `msg.sender`.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 tokenId) external {
        require(kittyToOwner[tokenId] == msg.sender, "not owner");
        require(to != address(0), "to zero address");
        require(to != address(this), "to contract address");

        _transfer(msg.sender, to, tokenId);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        // assign new owner
        kittyToOwner[_tokenId] = _to;

        //update token counts
        ownerKittyCount[_to] = ownerKittyCount[_to].add(1);

        if (_from != address(0)) {
            ownerKittyCount[_from] = ownerKittyCount[_from].sub(1);
        }

        // emit Transfer event
        emit Transfer(_from, _to, _tokenId);
    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external {
        address kittyOwner = kittyToOwner[_tokenId];
        require(
            msg.sender == kittyOwner ||
                msg.sender == kittyToApproved[_tokenId] ||
                _operatorApprovals[kittyOwner][msg.sender],
            "sender not kitty owner OR approved"
        );

        kittyToApproved[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external {
        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view returns (address) {
        require(_tokenId < kitties.length, "invalid kittyId");
        return kittyToApproved[_tokenId];
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool)
    {
        return _operatorApprovals[_owner][_operator];
    }
}
