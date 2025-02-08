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

// Constants from Story Protocol
const WIP_TOKEN = '0x1514000000000000000000000000000000000000' as Address;

async function registerCommercialLicense() {
  try {
    console.log("\nRegistering Commercial License Terms...");

    const response = await client.license.registerCommercialUsePIL({
      currency: WIP_TOKEN,
      defaultMintingFee: '500000000000000000', // 0.5 tokens
      txOptions: { waitForTransaction: true }
    });

    console.log("\nCommercial License Terms registered successfully!");
    console.log("License Terms ID:", response.licenseTermsId);
    console.log("Transaction Hash:", response.txHash);

    return response;
  } catch (error) {
    console.error("Error registering commercial license terms:", error);
    throw error;
  }
}

async function registerCommercialRemixLicense() {
  try {
    console.log("\nRegistering Commercial Remix License Terms...");

    const response = await client.license.registerCommercialRemixPIL({
      currency: WIP_TOKEN,
      defaultMintingFee: '2000000000000000000', // 2 tokens
      commercialRevShare: 100, // 1%
      txOptions: { waitForTransaction: true }
    });

    console.log("\nCommercial Remix License Terms registered successfully!");
    console.log("License Terms ID:", response.licenseTermsId);
    console.log("Transaction Hash:", response.txHash);

    return response;
  } catch (error) {
    console.error("Error registering commercial remix license terms:", error);
    throw error;
  }
}

async function registerNonCommercialLicense() {
  try {
    console.log("\nRegistering Non-Commercial Social Remixing License Terms...");

    const response = await client.license.registerNonComSocialRemixingPIL({
      txOptions: { waitForTransaction: true }
    });

    console.log("\nNon-Commercial License Terms registered successfully!");
    console.log("License Terms ID:", response.licenseTermsId);
    console.log("Transaction Hash:", response.txHash);

    return response;
  } catch (error) {
    console.error("Error registering non-commercial license terms:", error);
    throw error;
  }
}

// Example usage
async function main() {
  // Register all license types
  const commercialLicense = await registerCommercialLicense();
  const commercialRemixLicense = await registerCommercialRemixLicense();
  const nonCommercialLicense = await registerNonCommercialLicense();

  console.log("\nAll License Terms registered successfully!");
  console.log("\nLicense Terms IDs:");
  console.log("Commercial License:", commercialLicense.licenseTermsId);
  console.log("Commercial Remix License:", commercialRemixLicense.licenseTermsId);
  console.log("Non-Commercial License:", nonCommercialLicense.licenseTermsId);
}

// Only run if called directly
if (require.main === module) {
  main().catch(console.error);
}
