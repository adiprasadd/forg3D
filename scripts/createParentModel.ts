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

async function createParentModel() {
  try {
    // Mock metadata for parent 3D model
    const mockIpMetadata = {
      title: "Base 3D Character Model",
      description: "A base 3D character model that can be used as a foundation for derivatives",
      watermarkImg: "https://placehold.co/600x400",
      attributes: [
        { key: "Category", value: "Base Model" },
        { key: "Format", value: "GLB" },
        { key: "Type", value: "Character" },
      ],
    };

    const mockNftMetadata = {
      name: "Base 3D Character Model",
      description: "A base 3D character model that can be used as a foundation for derivatives",
      image: "https://placehold.co/600x400",
      attributes: {
        category: "Base Model",
        format: "GLB",
        type: "Character",
      },
    };

    // Create metadata hashes
    const ipHash = createHash('sha256').update(JSON.stringify(mockIpMetadata)).digest('hex');
    const nftHash = createHash('sha256').update(JSON.stringify(mockNftMetadata)).digest('hex');

    console.log("Registering parent 3D model...");
    
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: process.env.SPG_NFT_CONTRACT_ADDRESS as Address,
      licenseTermsData: [{
        terms: {
          transferable: true,
          royaltyPolicy: '0x0000000000000000000000000000000000000000' as Address,
          defaultMintingFee: BigInt(0),
          expiration: BigInt(0),
          commercialUse: false,
          commercialAttribution: false,
          commercializerChecker: '0x0000000000000000000000000000000000000000' as Address,
          commercializerCheckerData: '0x',
          commercialRevShare: 0,
          commercialRevCeiling: BigInt(0),
          derivativesAllowed: true,
          derivativesAttribution: true,
          derivativesApproval: false,
          derivativesReciprocal: true,
          derivativeRevCeiling: BigInt(0),
          currency: '0x0000000000000000000000000000000000000000' as Address,
          uri: '',
        },
        licensingConfig: {
          isSet: false,
          mintingFee: BigInt(0),
          licensingHook: '0x0000000000000000000000000000000000000000' as Address,
          hookData: '0x',
          commercialRevShare: 0,
          disabled: false,
          expectMinimumGroupRewardShare: 0,
          expectGroupRewardPool: '0x0000000000000000000000000000000000000000' as Address,
        }
      }],
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: 'https://example.com/ip-metadata',
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: 'https://example.com/nft-metadata',
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });

    console.log("\nParent Model Registration successful!");
    console.log("IP Asset ID:", response.ipId);
    console.log("Transaction Hash:", response.txHash);
    console.log("Explorer URL:", `https://explorer.story.foundation/ipa/${response.ipId}`);
    console.log("\nRoyalty Information:");
    console.log("- Your IP Asset has 100M Royalty Tokens");
    console.log("- Revenue Token: WIP (", WIP_TOKEN, ")");
    console.log("- Derivatives must share 5% of their revenue");
    console.log("- Minting Fee: 0.01 WIP tokens");

    // Save the IP Asset ID for the child model to use
    console.log("\nAdd this to your .env file:");
    console.log(`PARENT_IP_ASSET_ID=${response.ipId}`);
    
  } catch (error) {
    console.error("Error registering parent model:", error);
  }
}

// Run the script
createParentModel();
