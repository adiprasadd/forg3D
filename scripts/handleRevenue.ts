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

// WIP token address on Story Protocol
const WIP_TOKEN = '0x1514000000000000000000000000000000000000' as Address;

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
    const response = await client.royalties.payRoyaltyOnBehalf({
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

    // Get claimable amount
    const { claimableAmount } = await client.royalties.getClaimableAmount({
      ipId: params.ipAssetId,
      currency: params.currency,
    });
    console.log(`Claimable amount: ${claimableAmount}`);

    if (claimableAmount > BigInt(0)) {
      // Claim the revenue
      const response = await client.royalties.claimRoyalty({
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

    // Get the vault address for this IP Asset
    const vault = await client.royalties.getVault(ipAssetId);
    console.log("IP Asset Vault:", vault);

    // TODO: Add code to fetch and display revenue history
    // This will be implemented once the SDK supports it
  } catch (error) {
    console.error("Error getting revenue history:", error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const usage = `
Usage: 
  Check claimable revenue: npx ts-node scripts/handleRevenue.ts check <ipId>
  Claim revenue: npx ts-node scripts/handleRevenue.ts claim <ipId>

Arguments:
  action    The action to perform (check or claim)
  ipId      The ID of the IP asset

Example:
  npx ts-node scripts/handleRevenue.ts check 0x1234...5678
  npx ts-node scripts/handleRevenue.ts claim 0x1234...5678
`;

  if (args.length !== 2 || args.includes('--help')) {
    console.log(usage);
    process.exit(1);
  }

  const [action, ipId] = args;
  
  if (!['check', 'claim'].includes(action)) {
    console.error('Error: action must be either "check" or "claim"');
    console.log(usage);
    process.exit(1);
  }

  return {
    action,
    ipId: ipId as Address
  };
}

// Run if called directly
if (require.main === module) {
  const { action, ipId } = parseArgs();
  
  if (action === 'check') {
    // Just check claimable amount
    client.royalties.getClaimableAmount({
      ipId,
      currency: WIP_TOKEN,
    }).then(({ claimableAmount }) => {
      console.log('Claimable amount:', claimableAmount.toString(), 'WIP tokens');
    }).catch(console.error);
  } else {
    // Claim revenue
    claimRevenue({
      ipAssetId: ipId,
      currency: WIP_TOKEN,
    }).catch(console.error);
  }
}
