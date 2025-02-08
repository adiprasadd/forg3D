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

async function attachLicenseTerms(params: {
  ipId: string,
  licenseTermsIds: string[]
}) {
  try {
    console.log('Attaching license terms to IP Asset:', params.ipId);
    console.log('License Terms IDs:', params.licenseTermsIds);

    // Attach each license term to the IP asset
    for (const termId of params.licenseTermsIds) {
      console.log(`\nAttaching license term ${termId}...`);
      const response = await client.license.attachLicenseTerms({
        ipId: params.ipId as Address,
        licenseTermsId: termId,
        txOptions: { waitForTransaction: true }
      });

      console.log('License term attached successfully!');
      console.log('Transaction Hash:', response.txHash);
    }
  } catch (error) {
    console.error('Error attaching license terms:', error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const usage = `
Usage: npx ts-node scripts/attachLicenseTerms.ts <ipId> <licenseTermsIds...>

Arguments:
  ipId              The ID of the IP asset to attach license terms to
  licenseTermsIds   Space-separated list of license terms IDs to attach

Example:
  npx ts-node scripts/attachLicenseTerms.ts 0x1234...5678 111 112
`;

  if (args.length < 2 || args.includes('--help')) {
    console.log(usage);
    process.exit(1);
  }

  const [ipId, ...licenseTermsIds] = args;

  return {
    ipId,
    licenseTermsIds
  };
}

// Run if called directly
if (require.main === module) {
  const params = parseArgs();
  attachLicenseTerms(params).catch(console.error);
}
