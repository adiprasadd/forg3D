const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy ModelNFT
  const ModelNFT = await hre.ethers.getContractFactory("ModelNFT");
  const modelNFT = await ModelNFT.deploy();
  await modelNFT.deployed();
  console.log("ModelNFT deployed to:", modelNFT.address);

  // Deploy ModelLicense
  const ModelLicense = await hre.ethers.getContractFactory("ModelLicense");
  const modelLicense = await ModelLicense.deploy(modelNFT.address);
  await modelLicense.deployed();
  console.log("ModelLicense deployed to:", modelLicense.address);

  // Deploy ModelRegistry
  const ModelRegistry = await hre.ethers.getContractFactory("ModelRegistry");
  const modelRegistry = await ModelRegistry.deploy(modelNFT.address);
  await modelRegistry.deployed();
  console.log("ModelRegistry deployed to:", modelRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
