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
 * Get the claimable revenue for an IP asset
 * @param ipId The IP asset ID to check
 * @returns The claimable amount in WIP tokens
 */
async function getClaimableRevenue(ipId: string): Promise<bigint> {
  try {
    console.log('Checking claimable revenue for IP Asset:', ipId);

    // Get the claimable amount from the IP's royalty vault
    const claimable = await client.ipAsset.getClaimableRevenue({
      ipId: ipId as Address,
      currency: WIP_TOKEN,
    });

    console.log('Claimable amount:', claimable.toString(), 'WIP tokens');
    return claimable;
  } catch (error) {
    console.error('Error checking claimable revenue:', error);
    throw error;
  }
}

/**
 * Claim all available revenue for an IP asset
 * @param ipId The IP asset ID to claim revenue from
 * @returns The transaction hash of the claim
 */
async function claimAllRevenue(ipId: string): Promise<string> {
  try {
    console.log('Claiming revenue for IP Asset:', ipId);

    // First, check how much is claimable
    const claimableAmount = await getClaimableRevenue(ipId);
    
    if (claimableAmount <= BigInt(0)) {
      console.log('No revenue available to claim');
      return '';
    }

    // Get the vault address for this IP Asset
    const vault = await client.ipAsset.getVault(ipId as Address);
    console.log('IP Asset Vault:', vault);

    // Claim the revenue
    const response = await client.ipAsset.claimRevenue({
      ipId: ipId as Address,
      currency: WIP_TOKEN,
      txOptions: { waitForTransaction: true }
    });

    console.log('Revenue claimed successfully!');
    console.log('Transaction Hash:', response.txHash);
    return response.txHash;
  } catch (error) {
    console.error('Error claiming revenue:', error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const usage = `
Usage: 
  Check claimable revenue: npx ts-node scripts/handleIPRevenue.ts check <ipId>
  Claim all revenue: npx ts-node scripts/handleIPRevenue.ts claim <ipId>

Arguments:
  action    The action to perform (check or claim)
  ipId      The ID of the IP asset

Example:
  npx ts-node scripts/handleIPRevenue.ts check 0x1234...5678
  npx ts-node scripts/handleIPRevenue.ts claim 0x1234...5678
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
    ipId
  };
}

// Run if called directly
if (require.main === module) {
  const { action, ipId } = parseArgs();
  
  if (action === 'check') {
    getClaimableRevenue(ipId).catch(console.error);
  } else {
    claimAllRevenue(ipId).catch(console.error);
  }
}
