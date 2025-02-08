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
    console.log(`Checking claimable amount for IP Asset ${params.ipAssetId}...`);
    
    // First check how much is claimable
    const claimableAmount = await client.royalty.claimableRevenue({
      royaltyVaultIpId: params.ipAssetId,
      claimer: account.address,
      token: params.currency
    });

    console.log(`Claimable amount: ${claimableAmount.toString()} ${params.currency}`);

    if (claimableAmount <= 0n) {
      console.log('No revenue to claim.');
      return;
    }

    // Claim the revenue
    console.log('\nClaiming revenue...');
    const response = await client.royalty.claimAllRevenue({
      ancestorIpId: params.ipAssetId,
      claimer: account.address,
      childIpIds: [], // No child IPs in this case
      royaltyPolicies: [], // No specific policies
      currencyTokens: [params.currency]
    });

    console.log('\nRevenue claimed successfully!');
    console.log('Transaction Hashes:', response.txHashes);
    return response;
  } catch (error) {
    console.error('Error claiming revenue:', error);
    throw error;
  }
}

/**
 * Get revenue history for an IP Asset
 * This helps track all revenue movements for the asset
 */
async function getRevenueHistory(ipAssetId: Address) {
  try {
    console.log(`Getting revenue information for IP Asset ${ipAssetId}...`);
    
    // Get claimable revenue
    const claimableAmount = await client.royalty.claimableRevenue({
      royaltyVaultIpId: ipAssetId,
      claimer: account.address,
      token: WIP_TOKEN
    });
    
    console.log('\nClaimable Revenue:', claimableAmount.toString(), 'WIP tokens');
    
    return {
      claimableAmount
    };
  } catch (error) {
    console.error('Error getting revenue history:', error);
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
  View history: npx ts-node scripts/handleRevenue.ts history <ipId>

Arguments:
  action    The action to perform (check, claim, or history)
  ipId      The ID of the IP asset

Example:
  npx ts-node scripts/handleRevenue.ts check 0x1234...5678
  npx ts-node scripts/handleRevenue.ts claim 0x1234...5678
  npx ts-node scripts/handleRevenue.ts history 0x1234...5678
`;

  if (args.length !== 2 || args.includes('--help')) {
    console.log(usage);
    process.exit(1);
  }

  const [action, ipId] = args;
  
  if (!['check', 'claim', 'history'].includes(action)) {
    console.error('Error: action must be either "check", "claim", or "history"');
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
    client.royalty.claimableRevenue({
      royaltyVaultIpId: ipId,
      claimer: ipId,
      token: WIP_TOKEN
    }).then((claimableAmount) => {
      console.log('Claimable amount:', claimableAmount.toString(), 'WIP tokens');
    }).catch(console.error);
  } else if (action === 'claim') {
    // Claim revenue
    claimRevenue({
      ipAssetId: ipId,
      currency: WIP_TOKEN,
    }).catch(console.error);
  } else {
    // Get revenue history
    getRevenueHistory(ipId).catch(console.error);
  }
}

export { claimRevenue, getRevenueHistory };
