import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createHash } from 'crypto';
import { type Address } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

// Setup Story Protocol client
const rawPrivateKey = process.env.WALLET_PRIVATE_KEY || '';
const privateKey = `0x${rawPrivateKey.toLowerCase().padStart(64, '0')}` as `0x${string}`;
const account = privateKeyToAccount(privateKey);

const config: StoryConfig = {
  account,
  transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io'),
  chainId: 'aeneid',
};

const client = StoryClient.newClient(config);

// Constants for Story Protocol
const WIP_TOKEN = '0x1514000000000000000000000000000000000000' as Address;
const LAP_POLICY = '0x937bef10ba6fb941ed84b8d249abc76031429a9a' as Address;

async function createChildModel() {
  try {
    if (!process.env.PARENT_IP_ASSET_ID) {
      throw new Error("PARENT_IP_ASSET_ID not found in .env file");
    }

    // Mock metadata for derivative 3D model
    const mockIpMetadata = {
      title: "Custom Character Model",
      description: "A customized character model derived from the base model",
      watermarkImg: "https://placehold.co/600x400",
      attributes: [
        { key: "Category", value: "Derivative" },
        { key: "Format", value: "GLB" },
        { key: "Type", value: "Character" },
        { key: "Parent", value: process.env.PARENT_IP_ASSET_ID },
      ],
    };

    const mockNftMetadata = {
      name: "Custom Character Model",
      description: "A customized character model derived from the base model",
      image: "https://placehold.co/600x400",
      attributes: {
        category: "Derivative",
        format: "GLB",
        type: "Character",
        parent: process.env.PARENT_IP_ASSET_ID,
      },
    };

    // Create metadata hashes
    const ipHash = createHash('sha256').update(JSON.stringify(mockIpMetadata)).digest('hex');
    const nftHash = createHash('sha256').update(JSON.stringify(mockNftMetadata)).digest('hex');

    console.log("Registering derivative 3D model...");

    // Setup derivative data
    const response = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
      spgNftContract: process.env.SPG_NFT_CONTRACT_ADDRESS as Address,
      derivData: {
        parentIpIds: [process.env.PARENT_IP_ASSET_ID as `0x${string}`],
        licenseTermsIds: ["1"], // Using the first license terms from parent
        maxMintingFee: BigInt(0), // No minting fee for now
        maxRts: "100000000", // Default value
        maxRevenueShare: 100, // Default value
      },
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: 'https://example.com/ip-metadata',
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: 'https://example.com/nft-metadata',
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("\nDerivative Model Registration successful!");
    console.log("IP Asset ID:", response.ipId);
    console.log("NFT Token ID:", response.tokenId);
    console.log("Transaction Hash:", response.txHash);
    console.log("Explorer URL:", `https://explorer.story.foundation/ipa/${response.ipId}`);
    console.log("\nRelationship Information:");
    console.log("- Parent IP Asset:", process.env.PARENT_IP_ASSET_ID);
    console.log("- License Terms ID: 1");
    console.log("- Max Revenue Share: 100%");
    
  } catch (error) {
    console.error("Error registering derivative model:", error);
  }
}

// Run the script
createChildModel();
