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

async function checkLicenseTerms(ipId: string) {
  try {
    console.log('Checking license terms for IP Asset:', ipId);

    // Get license terms for our registered terms (111 and 112)
    const termIds = [111n, 112n];
    for (const termId of termIds) {
      try {
        console.log(`\nChecking term ID ${termId}...`);
        const { terms } = await client.license.getLicenseTerms(termId);

        console.log('Term Details:');
        console.log('Minting Fee:', terms.defaultMintingFee.toString(), 'wei');
        console.log('Revenue Share:', terms.commercialRevShare, 'basis points');
        console.log('Commercial Use:', terms.commercialUse ? 'Yes' : 'No');
        console.log('Derivatives Allowed:', terms.derivativesAllowed ? 'Yes' : 'No');
        console.log('Transferable:', terms.transferable ? 'Yes' : 'No');
        console.log('URI:', terms.uri);
      } catch (error) {
        console.log(`Term ID ${termId} not found or not attached to this IP asset.`);
      }
    }
  } catch (error) {
    console.error('Error checking license terms:', error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const usage = `
Usage: npx ts-node scripts/checkLicenseTerms.ts <ipId>

Arguments:
  ipId    The ID of the IP asset to check license terms for

Example:
  npx ts-node scripts/checkLicenseTerms.ts 0x1234...5678
`;

  if (args.length !== 1 || args.includes('--help')) {
    console.log(usage);
    process.exit(1);
  }

  return args[0];
}

// Run if called directly
if (require.main === module) {
  const ipId = parseArgs();
  checkLicenseTerms(ipId).catch(console.error);
}
