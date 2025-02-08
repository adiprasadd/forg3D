import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
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

// License tiers for different use cases
enum LicenseTier {
  INDIE,      // For indie developers (revenue < $100K)
  STANDARD,   // For medium studios (revenue < $1M)
  ENTERPRISE, // For large studios (revenue > $1M)
  UNLIMITED   // Full buyout with no restrictions
}

interface LicenseConfig {
  name: string;
  mintingFee: bigint;      // One-time fee
  revShare: number;        // Revenue share percentage (basis points: 100 = 1%)
  maxRevenue: bigint;      // Revenue ceiling
  usageLimits: {
    copies: number;        // Number of copies allowed
    projects: number;      // Number of projects allowed
    timeLimit: number;     // Time limit in seconds (0 = unlimited)
  };
  commercialRights: {
    modification: boolean; // Right to modify the asset
    resale: boolean;      // Right to resell modified versions
    sublicense: boolean;  // Right to sublicense to contractors
  };
}

// Define license configurations for each tier
const LICENSE_CONFIGS: Record<LicenseTier, LicenseConfig> = {
  [LicenseTier.INDIE]: {
    name: "Indie License",
    mintingFee: BigInt('100000000000000000'), // 0.1 tokens
    revShare: 500, // 5%
    maxRevenue: BigInt('100000000000000000000'), // 100 tokens
    usageLimits: {
      copies: 1,
      projects: 1,
      timeLimit: 31536000, // 1 year
    },
    commercialRights: {
      modification: true,
      resale: false,
      sublicense: false,
    }
  },
  [LicenseTier.STANDARD]: {
    name: "Standard License",
    mintingFee: BigInt('500000000000000000'), // 0.5 tokens
    revShare: 300, // 3%
    maxRevenue: BigInt('1000000000000000000000'), // 1000 tokens
    usageLimits: {
      copies: 5,
      projects: 3,
      timeLimit: 0, // Unlimited
    },
    commercialRights: {
      modification: true,
      resale: true,
      sublicense: true,
    }
  },
  [LicenseTier.ENTERPRISE]: {
    name: "Enterprise License",
    mintingFee: BigInt('2000000000000000000'), // 2 tokens
    revShare: 100, // 1%
    maxRevenue: BigInt('10000000000000000000000'), // 10000 tokens
    usageLimits: {
      copies: 999999,
      projects: 999999,
      timeLimit: 0, // Unlimited
    },
    commercialRights: {
      modification: true,
      resale: true,
      sublicense: true,
    }
  },
  [LicenseTier.UNLIMITED]: {
    name: "Unlimited License",
    mintingFee: BigInt('10000000000000000000'), // 10 tokens
    revShare: 0, // 0%
    maxRevenue: BigInt(0), // No revenue sharing
    usageLimits: {
      copies: 999999,
      projects: 999999,
      timeLimit: 0, // Unlimited
    },
    commercialRights: {
      modification: true,
      resale: true,
      sublicense: true,
    }
  }
};

/**
 * Create a new IP Asset with all license tiers
 * This allows users to choose their appropriate tier when purchasing
 */
async function createMultiTierAsset(params: {
  spgNftContract: Address,
  ipMetadata: {
    ipMetadataURI: string,
    ipMetadataHash: `0x${string}`,
    nftMetadataURI: string,
    nftMetadataHash: `0x${string}`,
  },
}) {
  try {
    console.log("Creating IP Asset with all license tiers...");

    // Create license terms for all tiers
    const licenseTermsData = Object.entries(LICENSE_CONFIGS).map(([_, config]) => ({
      terms: {
        transferable: true,
        royaltyPolicy: '0x0000000000000000000000000000000000000000' as `0x${string}`, // No royalty policy for now
        defaultMintingFee: BigInt(0), // No minting fee for now
        expiration: BigInt(config.usageLimits.timeLimit),
        commercialUse: false, // Disable commercial use for now
        commercialAttribution: false,
        commercializerChecker: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        commercializerCheckerData: '0x' as `0x${string}`,
        commercialRevShare: 0,
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: config.commercialRights.modification,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: BigInt(0),
        currency: '0x0000000000000000000000000000000000000000' as `0x${string}`, // No currency for now
        uri: JSON.stringify({
          name: config.name,
          usageLimits: config.usageLimits,
          commercialRights: config.commercialRights
        }),
      },
      licensingConfig: {
        isSet: true,
        mintingFee: BigInt(0), // No minting fee for now
        licensingHook: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        hookData: '0x' as `0x${string}`,
        commercialRevShare: 0,
        disabled: false,
        expectMinimumGroupRewardShare: 0,
        expectGroupRewardPool: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      }
    }));

    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: params.spgNftContract,
      licenseTermsData,
      allowDuplicates: true,
      ipMetadata: params.ipMetadata,
      txOptions: { waitForTransaction: true },
    });

    console.log("\nIP Asset created successfully!");
    console.log("IP Asset ID:", response.ipId);
    console.log("Transaction Hash:", response.txHash);
    console.log("\nLicense Tiers Created:");

    // Print details for each tier
    Object.entries(LICENSE_CONFIGS).forEach(([tier, config], index) => {
      console.log(`\n${config.name} (Terms ID: ${index + 1}):`);
      console.log("Financial Terms:");
      console.log("- Minting Fee:", config.mintingFee.toString(), "tokens");
      console.log("- Revenue Share:", config.revShare / 100, "%");
      console.log("- Revenue Ceiling:", config.maxRevenue.toString(), "tokens");
      
      console.log("\nUsage Limits:");
      console.log("- Copies:", config.usageLimits.copies);
      console.log("- Projects:", config.usageLimits.projects);
      console.log("- Time Limit:", config.usageLimits.timeLimit === 0 ? "Unlimited" : `${config.usageLimits.timeLimit / 86400} days`);
      
      console.log("\nCommercial Rights:");
      console.log("- Modification:", config.commercialRights.modification ? "Yes" : "No");
      console.log("- Resale:", config.commercialRights.resale ? "Yes" : "No");
      console.log("- Sublicense:", config.commercialRights.sublicense ? "Yes" : "No");
    });

    return response;
  } catch (error) {
    console.error("Error creating multi-tier asset:", error);
    throw error;
  }
}

// Example usage
async function main() {
  if (!process.env.SPG_NFT_CONTRACT_ADDRESS) {
    throw new Error("SPG_NFT_CONTRACT_ADDRESS not found in .env file");
  }

  // Create a 3D model with all license tiers
  await createMultiTierAsset({
    spgNftContract: process.env.SPG_NFT_CONTRACT_ADDRESS as Address,
    ipMetadata: {
      ipMetadataURI: 'https://example.com/ip-metadata',
      ipMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
      nftMetadataURI: 'https://example.com/nft-metadata',
      nftMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
    },
  });
}

// Only run if called directly
if (require.main === module) {
  main().catch(console.error);
}
