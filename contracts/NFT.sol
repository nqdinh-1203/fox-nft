// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface INFT {
    function mint(address to) external returns (uint256);
}

contract NFT is ERC721Enumerable, ERC721URIStorage, INFT {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIDTracker;

    string public mockTokenURI = "https://famousfoxes.com/hd/";
    address nftMarketplace;

    event Mint(address to, uint256 tokenId);

    constructor() ERC721("Fox Token", "FT") {}

    function mint(address to) external override returns (uint256) {
        uint256 tokenId = _tokenIDTracker.current();

        _safeMint(to, tokenId);

        string memory newURI = string.concat(
            mockTokenURI,
            Strings.toString(tokenId),
            ".png"
        );

        _setTokenURI(tokenId, newURI);

        _tokenIDTracker.increment();

        emit Mint(to, tokenId);
        return tokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721Enumerable, ERC721) {
        return super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721Enumerable, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }
}
