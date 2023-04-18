// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/utils/Counters.sol";
// ierc721
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMarketplace {
    address nftAddress;
    address tokenAddress;

    struct Item {
        uint256 price;
        address seller;
        uint256 tokenId;
        bool listed;
    }

    constructor(address _nftAddress, address _tokenAddress) {
        nftAddress = _nftAddress;
        tokenAddress = _tokenAddress;
    }

    mapping(uint256 => Item) public items;

    function listNft(uint256 tokenId, uint256 price) public {
        require(price > 0, "Nft must have price while listing");
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        items[tokenId] = Item(price, msg.sender, tokenId, true);
    }

    function delistNft(uint256 tokenId) public {
        require(
            msg.sender == items[tokenId].seller,
            "Only seller can delist item"
        );
        require(items[tokenId].listed, "Item not listed");

        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);

        delete items[tokenId];
    }

    function updateNftPrice(uint256 tokenId, uint256 newPrice) public {
        require(
            msg.sender == items[tokenId].seller,
            "Only seller can delist item"
        );
        require(items[tokenId].listed, "Item not listed");

        Item storage item = items[tokenId];
        item.price = newPrice;
    }

    function getPriceOf(uint256 tokenId) public view returns (uint256) {
        require(items[tokenId].listed, "Item not listed");
        return items[tokenId].price;
    }

    function buyNft(uint tokenId, uint256 price) public {
        require(items[tokenId].listed, "Item not listed");
        require(
            price >= items[tokenId].price,
            "Minimum price has not been reached"
        );

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            items[tokenId].seller,
            price
        );
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
        delete items[tokenId];
    }

    function getAllNfts() public view returns (Item[] memory) {
        uint balance = IERC721Enumerable(nftAddress).balanceOf(address(this));
        Item[] memory myNFTs = new Item[](balance);

        for (uint i = 0; i < balance; i++) {
            myNFTs[i] = items[
                IERC721Enumerable(nftAddress).tokenOfOwnerByIndex(
                    address(this),
                    i
                )
            ];
        }

        return myNFTs;
    }
}
