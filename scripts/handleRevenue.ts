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

/**
 * Pay royalties for using an IP Asset
 * This should be called when:
 * 1. Someone purchases a license to use the 3D model
 * 2. Someone makes a derivative and pays the initial fee
 * 3. Revenue is generated from the use of the 3D model
 */
async function payRoyalties(params: {
  ipAssetId: Address,
  amount: bigint,
  currency: Address,
  description: string
}) {
  try {
    console.log(`Paying royalties for IP Asset ${params.ipAssetId}...`);
    console.log(`Amount: ${params.amount} ${params.currency}`);
    console.log(`Description: ${params.description}`);

    // Pay royalties to the IP Asset's vault
    const response = await client.ipAsset.payRoyaltyOnBehalf({
      ipId: params.ipAssetId,
      amount: params.amount,
      currency: params.currency,
      txOptions: { waitForTransaction: true },
    });

    console.log("\nRoyalty payment successful!");
    console.log("Transaction Hash:", response.txHash);
    
    return response;
  } catch (error) {
    console.error("Error paying royalties:", error);
    throw error;
  }
}

/**
 * Claim revenue from an IP Asset's vault
 * This should be called when:
 * 1. An IP Asset owner wants to withdraw their earnings
 * 2. A derivative creator wants to claim their share
 */
async function claimRevenue(params: {
  ipAssetId: Address,
  currency: Address
}) {
  try {
    console.log(`Claiming revenue for IP Asset ${params.ipAssetId}...`);

    // Get the vault address for this IP Asset
    const vault = await client.ipAsset.getVault(params.ipAssetId);
    console.log("IP Asset Vault:", vault);

    // Get claimable amount
    const claimable = await client.ipAsset.getClaimableRevenue({
      ipId: params.ipAssetId,
      currency: params.currency,
    });
    console.log(`Claimable amount: ${claimable}`);

    if (claimable > BigInt(0)) {
      // Claim the revenue
      const response = await client.ipAsset.claimRevenue({
        ipId: params.ipAssetId,
        currency: params.currency,
        txOptions: { waitForTransaction: true },
      });

      console.log("\nRevenue claim successful!");
      console.log("Transaction Hash:", response.txHash);
      return response;
    } else {
      console.log("No revenue to claim");
      return null;
    }
  } catch (error) {
    console.error("Error claiming revenue:", error);
    throw error;
  }
}

/**
 * Get revenue history for an IP Asset
 * This helps track all revenue movements for the asset
 */
async function getRevenueHistory(ipAssetId: Address) {
  try {
    console.log(`Getting revenue history for IP Asset ${ipAssetId}...`);

    // Get the vault address
    const vault = await client.ipAsset.getVault(ipAssetId);
    console.log("IP Asset Vault:", vault);

    // Get all revenue events (this would need to be implemented using blockchain events)
    // For now we can use the Story Protocol Explorer to view the history
    console.log(`View revenue history at: https://explorer.story.foundation/ipa/${ipAssetId}`);
  } catch (error) {
    console.error("Error getting revenue history:", error);
    throw error;
  }
}

// Example usage:
async function main() {
  if (!process.env.PARENT_IP_ASSET_ID || !process.env.CHILD_IP_ASSET_ID) {
    throw new Error("IP Asset IDs not found in .env file");
  }

  // Example: Pay royalties when someone uses the child model
  await payRoyalties({
    ipAssetId: process.env.CHILD_IP_ASSET_ID as Address,
    amount: BigInt('1000000000000000000'), // 1 token
    currency: '0x1514000000000000000000000000000000000000' as Address, // WIP token
    description: "Usage fee for 3D model",
  });

  // The payment will automatically be distributed:
  // 1. Parent model gets its share (e.g., 5%)
  // 2. Child model gets the rest (95%)

  // Example: Claim revenue as the child model owner
  await claimRevenue({
    ipAssetId: process.env.CHILD_IP_ASSET_ID as Address,
    currency: '0x1514000000000000000000000000000000000000' as Address, // WIP token
  });

  // Example: View revenue history
  await getRevenueHistory(process.env.CHILD_IP_ASSET_ID as Address);
}

// Only run if called directly
if (require.main === module) {
  main().catch(console.error);
}
