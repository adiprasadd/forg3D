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
const MERC20_TOKEN = '0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E' as Address;
const LAP_POLICY = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E' as Address;

async function testModelRegistration() {
  try {
    // Mock metadata for a 3D model
    const mockIpMetadata = {
      title: "Premium 3D Model",
      description: "A high-quality 3D model with commercial licensing",
      watermarkImg: "https://placehold.co/600x400",
      attributes: [
        { key: "Category", value: "Premium" },
        { key: "Format", value: "GLB" },
        { key: "Commercial", value: "Yes" },
      ],
    };

    const mockNftMetadata = {
      name: "Premium 3D Model",
      description: "A high-quality 3D model with commercial licensing",
      image: "https://placehold.co/600x400",
      attributes: {
        category: "Premium",
        format: "GLB",
        commercial: "Yes",
      },
    };

    // Create metadata hashes
    const ipHash = createHash('sha256').update(JSON.stringify(mockIpMetadata)).digest('hex');
    const nftHash = createHash('sha256').update(JSON.stringify(mockNftMetadata)).digest('hex');

    console.log("Registering 3D model with commercial license terms...");
    
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: process.env.SPG_NFT_CONTRACT_ADDRESS as Address,
      licenseTermsData: [{
        terms: {
          transferable: true,
          royaltyPolicy: LAP_POLICY,
          defaultMintingFee: BigInt('10000000000000000'), // 0.01 MERC20 tokens
          expiration: BigInt(0), // No expiration
          commercialUse: true,
          commercialAttribution: true,
          commercializerChecker: '0x0000000000000000000000000000000000000000' as Address,
          commercializerCheckerData: '0x',
          commercialRevShare: 10, // 10% revenue share
          commercialRevCeiling: BigInt(0), // No ceiling
          derivativesAllowed: true,
          derivativesAttribution: true,
          derivativesApproval: false,
          derivativesReciprocal: true,
          derivativeRevCeiling: BigInt(0),
          currency: MERC20_TOKEN, // Use MERC20 token for payments
          uri: '',
        },
        licensingConfig: {
          isSet: true,
          mintingFee: BigInt('10000000000000000'), // 0.01 MERC20 tokens
          licensingHook: '0x0000000000000000000000000000000000000000' as Address,
          hookData: '0x',
          commercialRevShare: 10, // 10% revenue share
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

    console.log("\nRegistration successful!");
    console.log("IP Asset ID:", response.ipId);
    console.log("Transaction Hash:", response.txHash);
    console.log("Explorer URL:", `https://explorer.story.foundation/ipa/${response.ipId}`);
    console.log("\nRoyalty Information:");
    console.log("- Your IP Asset has 100M Royalty Tokens");
    console.log("- Revenue Token: MERC20 (", MERC20_TOKEN, ")");
    console.log("- Commercial Use: Enabled with 10% revenue share");
    console.log("- Minting Fee: 0.01 MERC20 tokens");
    
  } catch (error) {
    console.error("Error registering 3D model:", error);
  }
}

// Run the test
testModelRegistration();
