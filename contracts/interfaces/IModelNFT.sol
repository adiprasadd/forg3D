// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IModelNFT {
    struct ModelMetadata {
        string name;
        string description;
        string modelURI;
        address creator;
        uint256 basePrice;
        bool isActive;
    }

    event ModelCreated(uint256 indexed tokenId, address indexed creator, string name);
    event ModelUpdated(uint256 indexed tokenId, string name);
    
    function createModel(string memory name, string memory description, string memory modelURI, uint256 basePrice) external returns (uint256);
    function updateModelMetadata(uint256 tokenId, string memory name, string memory description, string memory modelURI) external;
    function getModelMetadata(uint256 tokenId) external view returns (ModelMetadata memory);
}
