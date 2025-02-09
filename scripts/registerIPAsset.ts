import { StoryClient } from "@story-protocol/core-sdk";
import { toHex, Address, zeroAddress, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";

config();

const initStoryClient = () => {
  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error("Missing required environment variables");
  }

  const privateKey = `0x${process.env.WALLET_PRIVATE_KEY.toLowerCase().padStart(
    64,
    "0"
  )}` as `0x${string}`;
  const account = privateKeyToAccount(privateKey);

  const transport = http(
    process.env.RPC_PROVIDER_URL || "https://aeneid.storyrpc.io"
  );
  const publicClient = createPublicClient({ transport });

  return StoryClient.newClient({
    account,
    transport,
    chainId: "aeneid",
  });
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
async function createAndRegisterIPAsset(name: string, description: string, metadataUri: string): Promise<`0x${string}`> {
    try {
        const client = initStoryClient();

        // First, create a new NFT collection
        console.log('Creating new NFT collection...');
        const newCollection = await client.nftClient.createNFTCollection({
            name: name + ' Collection',
            symbol: name.substring(0, 5).toUpperCase(),
            isPublicMinting: true,
            mintOpen: true,
            mintFeeRecipient: zeroAddress,
            contractURI: '',
            txOptions: { waitForTransaction: true },
        });
=======
interface ModelMetadata {
  name: string;
  description: string;
  modelUrl: string;
  previewUrl?: string;
  price: string;
  royaltyPercentage: string;
}

interface IPAssetResponse {
  txHash: string;
  ipId: string;
  tokenId?: bigint;
  spgNftContract: string;
}
>>>>>>> Stashed changes

export async function createAndRegisterIPAsset(
  metadata: ModelMetadata
): Promise<IPAssetResponse> {
  try {
    const client = initStoryClient();

<<<<<<< Updated upstream
        // Now mint and register an IP asset
        console.log('Minting and registering IP asset...');
        const response = await client.ipAsset.mintAndRegisterIp({
            spgNftContract: newCollection.spgNftContract as Address,
            allowDuplicates: true,
            ipMetadata: {
                ipMetadataURI: metadataUri,
                ipMetadataHash: toHex(description, { size: 32 }),
            },
            txOptions: { waitForTransaction: true },
        });

        console.log('IP Asset registered:', response);
        if (!response.ipId) {
            throw new Error('No IP ID returned from registration');
        }
        return response.ipId;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const usage = `
Usage: npx ts-node scripts/registerIPAsset.ts <name> <description> <metadataUri>

Arguments:
  name          Name of the IP asset
  description   Description of the IP asset
  metadataUri   URI of the IP asset metadata

Example:
  npx ts-node scripts/registerIPAsset.ts "My IP Asset" "A description" "https://example.com/metadata.json"
`;

    if (args.length !== 3 || args.includes('--help')) {
        console.log(usage);
        process.exit(1);
    }

    return {
        name: args[0],
        description: args[1],
        metadataUri: args[2]
    };
=======
    // First, create a new NFT collection
    console.log("\n🔵 Step 1: Creating new NFT collection...");
    console.log("Collection Name:", `${metadata.name} Collection`);
    const newCollection = await client.nftClient.createNFTCollection({
      name: `${metadata.name} Collection`,
      symbol: "3DMDL",
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: "",
      txOptions: { waitForTransaction: true },
    });

    console.log("\n✅ NFT Collection created successfully:");
    console.log("- Contract Address:", newCollection.spgNftContract);
    console.log("- Transaction Hash:", newCollection.txHash);

    // Create metadata for IP asset registration
    console.log("\n🔵 Step 2: Preparing metadata for IP asset...");
    const ipMetadata = {
      title: metadata.name,
      description: metadata.description,
      modelUrl: metadata.modelUrl,
      previewUrl: metadata.previewUrl,
      attributes: [
        { key: "Category", value: "3D Model" },
        { key: "Price", value: metadata.price },
        { key: "RoyaltyPercentage", value: metadata.royaltyPercentage },
      ],
    };

    const nftMetadata = {
      name: metadata.name,
      description: metadata.description,
      image: metadata.previewUrl,
      attributes: {
        category: "3D Model",
        price: metadata.price,
        royaltyPercentage: metadata.royaltyPercentage,
      },
    };

    console.log("IP Metadata:", JSON.stringify(ipMetadata, null, 2));
    console.log("NFT Metadata:", JSON.stringify(nftMetadata, null, 2));

    // Create metadata hashes
    const ipMetadataHash = toHex(JSON.stringify(ipMetadata), { size: 32 });
    const nftMetadataHash = toHex(JSON.stringify(nftMetadata), { size: 32 });

    // Now mint and register an IP asset
    console.log("\n🔵 Step 3: Minting and registering IP asset...");
    console.log("Using NFT Contract:", newCollection.spgNftContract);
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: newCollection.spgNftContract as Address,
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: `https://example.com/ip-metadata/${metadata.modelUrl}`,
        ipMetadataHash,
        nftMetadataURI: `https://example.com/nft-metadata/${metadata.modelUrl}`,
        nftMetadataHash,
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("\n✅ IP Asset minted and registered successfully:");
    console.log("- IP Asset ID:", response.ipId);
    console.log("- Token ID:", response.tokenId?.toString());
    console.log("- Transaction Hash:", response.txHash);
    console.log("- Contract Address:", newCollection.spgNftContract);

    return {
      ...response,
      spgNftContract: newCollection.spgNftContract,
    };
  } catch (error) {
    console.error("Error creating and registering IP asset:", error);
    throw error;
  }
}

async function registerExistingNFT(nftContract: Address, tokenId: string) {
  try {
    const client = initStoryClient();

=======
interface ModelMetadata {
  name: string;
  description: string;
  modelUrl: string;
  previewUrl?: string;
  price: string;
  royaltyPercentage: string;
}

interface IPAssetResponse {
  txHash: string;
  ipId: string;
  tokenId?: bigint;
  spgNftContract: string;
}

export async function createAndRegisterIPAsset(
  metadata: ModelMetadata
): Promise<IPAssetResponse> {
  try {
    const client = initStoryClient();

    // First, create a new NFT collection
    console.log("\n🔵 Step 1: Creating new NFT collection...");
    console.log("Collection Name:", `${metadata.name} Collection`);
    const newCollection = await client.nftClient.createNFTCollection({
      name: `${metadata.name} Collection`,
      symbol: "3DMDL",
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: "",
      txOptions: { waitForTransaction: true },
    });

    console.log("\n✅ NFT Collection created successfully:");
    console.log("- Contract Address:", newCollection.spgNftContract);
    console.log("- Transaction Hash:", newCollection.txHash);

    // Create metadata for IP asset registration
    console.log("\n🔵 Step 2: Preparing metadata for IP asset...");
    const ipMetadata = {
      title: metadata.name,
      description: metadata.description,
      modelUrl: metadata.modelUrl,
      previewUrl: metadata.previewUrl,
      attributes: [
        { key: "Category", value: "3D Model" },
        { key: "Price", value: metadata.price },
        { key: "RoyaltyPercentage", value: metadata.royaltyPercentage },
      ],
    };

    const nftMetadata = {
      name: metadata.name,
      description: metadata.description,
      image: metadata.previewUrl,
      attributes: {
        category: "3D Model",
        price: metadata.price,
        royaltyPercentage: metadata.royaltyPercentage,
      },
    };

    console.log("IP Metadata:", JSON.stringify(ipMetadata, null, 2));
    console.log("NFT Metadata:", JSON.stringify(nftMetadata, null, 2));

    // Create metadata hashes
    const ipMetadataHash = toHex(JSON.stringify(ipMetadata), { size: 32 });
    const nftMetadataHash = toHex(JSON.stringify(nftMetadata), { size: 32 });

    // Now mint and register an IP asset
    console.log("\n🔵 Step 3: Minting and registering IP asset...");
    console.log("Using NFT Contract:", newCollection.spgNftContract);
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: newCollection.spgNftContract as Address,
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: `https://example.com/ip-metadata/${metadata.modelUrl}`,
        ipMetadataHash,
        nftMetadataURI: `https://example.com/nft-metadata/${metadata.modelUrl}`,
        nftMetadataHash,
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("\n✅ IP Asset minted and registered successfully:");
    console.log("- IP Asset ID:", response.ipId);
    console.log("- Token ID:", response.tokenId?.toString());
    console.log("- Transaction Hash:", response.txHash);
    console.log("- Contract Address:", newCollection.spgNftContract);

    return {
      ...response,
      spgNftContract: newCollection.spgNftContract,
    };
  } catch (error) {
    console.error("Error creating and registering IP asset:", error);
    throw error;
  }
}

async function registerExistingNFT(nftContract: Address, tokenId: string) {
  try {
    const client = initStoryClient();

>>>>>>> Stashed changes
=======
interface ModelMetadata {
  name: string;
  description: string;
  modelUrl: string;
  previewUrl?: string;
  price: string;
  royaltyPercentage: string;
}

interface IPAssetResponse {
  txHash: string;
  ipId: string;
  tokenId?: bigint;
  spgNftContract: string;
}

export async function createAndRegisterIPAsset(
  metadata: ModelMetadata
): Promise<IPAssetResponse> {
  try {
    const client = initStoryClient();

    // First, create a new NFT collection
    console.log("\n🔵 Step 1: Creating new NFT collection...");
    console.log("Collection Name:", `${metadata.name} Collection`);
    const newCollection = await client.nftClient.createNFTCollection({
      name: `${metadata.name} Collection`,
      symbol: "3DMDL",
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: "",
      txOptions: { waitForTransaction: true },
    });

    console.log("\n✅ NFT Collection created successfully:");
    console.log("- Contract Address:", newCollection.spgNftContract);
    console.log("- Transaction Hash:", newCollection.txHash);

    // Create metadata for IP asset registration
    console.log("\n🔵 Step 2: Preparing metadata for IP asset...");
    const ipMetadata = {
      title: metadata.name,
      description: metadata.description,
      modelUrl: metadata.modelUrl,
      previewUrl: metadata.previewUrl,
      attributes: [
        { key: "Category", value: "3D Model" },
        { key: "Price", value: metadata.price },
        { key: "RoyaltyPercentage", value: metadata.royaltyPercentage },
      ],
    };

    const nftMetadata = {
      name: metadata.name,
      description: metadata.description,
      image: metadata.previewUrl,
      attributes: {
        category: "3D Model",
        price: metadata.price,
        royaltyPercentage: metadata.royaltyPercentage,
      },
    };

    console.log("IP Metadata:", JSON.stringify(ipMetadata, null, 2));
    console.log("NFT Metadata:", JSON.stringify(nftMetadata, null, 2));

    // Create metadata hashes
    const ipMetadataHash = toHex(JSON.stringify(ipMetadata), { size: 32 });
    const nftMetadataHash = toHex(JSON.stringify(nftMetadata), { size: 32 });

    // Now mint and register an IP asset
    console.log("\n🔵 Step 3: Minting and registering IP asset...");
    console.log("Using NFT Contract:", newCollection.spgNftContract);
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: newCollection.spgNftContract as Address,
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: `https://example.com/ip-metadata/${metadata.modelUrl}`,
        ipMetadataHash,
        nftMetadataURI: `https://example.com/nft-metadata/${metadata.modelUrl}`,
        nftMetadataHash,
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("\n✅ IP Asset minted and registered successfully:");
    console.log("- IP Asset ID:", response.ipId);
    console.log("- Token ID:", response.tokenId?.toString());
    console.log("- Transaction Hash:", response.txHash);
    console.log("- Contract Address:", newCollection.spgNftContract);

    return {
      ...response,
      spgNftContract: newCollection.spgNftContract,
    };
  } catch (error) {
    console.error("Error creating and registering IP asset:", error);
    throw error;
  }
}

async function registerExistingNFT(nftContract: Address, tokenId: string) {
  try {
    const client = initStoryClient();

>>>>>>> Stashed changes
    console.log("Registering existing NFT as IP asset...");
    const response = await client.ipAsset.register({
      nftContract,
      tokenId,
      ipMetadata: {
        ipMetadataURI: "https://your-metadata-uri.com/model1",
        ipMetadataHash: toHex("model-metadata-hash", { size: 32 }),
        nftMetadataHash: toHex("model-nft-metadata-hash", { size: 32 }),
        nftMetadataURI: "https://your-metadata-uri.com/model1/nft",
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("IP Asset registered:", response);
    return response;
  } catch (error) {
    console.error("Error registering existing NFT:", error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    await createAndRegisterIPAsset({
      name: "Sample Model",
      description: "This is a sample 3D model",
      modelUrl: "https://example.com/model1.glb",
      previewUrl: "https://example.com/model1.png",
      price: "100",
      royaltyPercentage: "5",
    });
  } catch (error) {
    console.error("Error in main:", error);
    process.exit(1);
  }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}

// Run if called directly
if (require.main === module) {
    const { name, description, metadataUri } = parseArgs();
    createAndRegisterIPAsset(name, description, metadataUri)
        .then(ipId => {
            // Just output the IP ID by itself so it can be captured by scripts
            console.log(ipId);
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

export { createAndRegisterIPAsset };
