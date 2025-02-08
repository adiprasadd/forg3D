import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createHash } from 'crypto';
import { type Address, zeroAddress } from 'viem';
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

async function testModelRegistration() {
  try {
    // Mock metadata
    const mockIpMetadata = {
      title: "Test 3D Model",
      description: "A test 3D model for our marketplace",
      watermarkImg: "https://placehold.co/600x400",
      attributes: [
        { key: "Category", value: "Test" },
        { key: "Format", value: "GLB" },
      ],
    };

    const mockNftMetadata = {
      name: "Test 3D Model",
      description: "A test 3D model for our marketplace",
      image: "https://placehold.co/600x400",
      attributes: {
        category: "Test",
        format: "GLB",
      },
    };

    // Create metadata hashes
    const ipHash = createHash('sha256').update(JSON.stringify(mockIpMetadata)).digest('hex');
    const nftHash = createHash('sha256').update(JSON.stringify(mockNftMetadata)).digest('hex');

    console.log("Registering 3D model with license terms...");
    
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: process.env.SPG_NFT_CONTRACT_ADDRESS as Address,
      licenseTermsData: [{
        terms: {
          transferable: true,
          royaltyPolicy: zeroAddress,  // Use zero address for now
          defaultMintingFee: BigInt(0), // No minting fee
          expiration: BigInt(0),        // No expiration
          commercialUse: false,         // Disable commercial use for now
          commercialAttribution: false,
          commercializerChecker: zeroAddress,
          commercializerCheckerData: '0x',
          commercialRevShare: 0,        // No revenue share
          commercialRevCeiling: BigInt(0),
          derivativesAllowed: true,
          derivativesAttribution: true,
          derivativesApproval: false,
          derivativesReciprocal: true,
          derivativeRevCeiling: BigInt(0),
          currency: zeroAddress,        // Use zero address for now
          uri: '',
        },
        licensingConfig: {
          isSet: false,
          mintingFee: BigInt(0),
          licensingHook: zeroAddress,
          hookData: '0x',
          commercialRevShare: 0,
          disabled: false,
          expectMinimumGroupRewardShare: 0,
          expectGroupRewardPool: zeroAddress,
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

    console.log("\nRegistration successful!");
    console.log("IP Asset ID:", response.ipId);
    console.log("Transaction Hash:", response.txHash);
    console.log("Explorer URL:", `https://explorer.story.foundation/ipa/${response.ipId}`);
    
  } catch (error) {
    console.error("Error registering 3D model:", error);
  }
}

// Run the test
testModelRegistration();
