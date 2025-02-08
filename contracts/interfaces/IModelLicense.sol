// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IModelLicense {
    enum LicenseType { Personal, Commercial, Enterprise }
    
    struct License {
        uint256 modelId;
        LicenseType licenseType;
        uint256 price;
        uint256 duration;
        bool isActive;
    }

    event LicenseCreated(uint256 indexed licenseId, uint256 indexed modelId, address indexed licensee);
    event LicenseTransferred(uint256 indexed licenseId, address indexed from, address indexed to);
    
    function createLicense(uint256 modelId, LicenseType licenseType, uint256 duration) external payable returns (uint256);
    function getLicense(uint256 licenseId) external view returns (License memory);
    function isLicenseValid(uint256 licenseId) external view returns (bool);
}
