// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IModelRegistry {
    event ModelRegistered(uint256 indexed modelId, address indexed creator);
    event ModelVerified(uint256 indexed modelId, address indexed verifier);
    
    function registerModel(uint256 modelId) external;
    function verifyModel(uint256 modelId) external;
    function isModelVerified(uint256 modelId) external view returns (bool);
    function getModelCreator(uint256 modelId) external view returns (address);
}
