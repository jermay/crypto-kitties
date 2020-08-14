pragma solidity ^0.5.12;

interface IERC721Receiver {
    function onERC721Received(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata _data
    ) external returns (bytes4);
}
