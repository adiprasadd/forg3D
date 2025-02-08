import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
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

async function createRoyaltyPolicy() {
  try {
    console.log("Creating Linear Absolute Percentage (LAP) Royalty Policy...");
    
    // Create a LAP Royalty Policy with 10% royalty
    const response = await client.royaltyPolicy.createLAP({
      absolutePercentage: 1000, // 10.00% (percentage * 100)
      txOptions: { waitForTransaction: true },
    });

    console.log("\nRoyalty Policy created successfully!");
    console.log("Policy Address:", response.policyAddress);
    console.log("Transaction Hash:", response.txHash);
    console.log("\nAdd this to your .env file:");
    console.log(`ROYALTY_POLICY_LAP_ADDRESS=${response.policyAddress}`);
    
  } catch (error) {
    console.error("Error creating royalty policy:", error);
  }
}

// Run the script
createRoyaltyPolicy();
