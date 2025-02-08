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

enum LicenseType {
  UPFRONT_ONLY = 'upfront',
  REVENUE_SHARE = 'revenue'
}

async function mintLicense(params: {
  ipId: string,
  licenseType: LicenseType
}) {
  try {
    console.log('Minting license for IP Asset:', params.ipId);
    console.log('License Type:', params.licenseType);

    // Choose term ID based on license type (111 for upfront, 112 for revenue share)
    const termId = params.licenseType === LicenseType.UPFRONT_ONLY ? "111" : "112";

    // Mint the license token
    console.log('\nMinting license with term ID:', termId);
    const response = await client.license.mintLicenseTokens({
      licenseTermsId: termId,
      licensorIpId: params.ipId as Address,
      receiver: account.address,
      amount: 1,
      maxMintingFee: BigInt('10000000000000000000'), // 10 WIP tokens as max fee
      maxRevenueShare: 30, // 30% as max revenue share
      txOptions: { waitForTransaction: true }
    });

    console.log('\nLicense minted successfully!');
    if (response.licenseTokenIds) {
      console.log('License Token IDs:', response.licenseTokenIds);
      console.log('Explorer URL:', `https://explorer.story.foundation/license/${response.licenseTokenIds[0]}`);
    }
    console.log('Transaction Hash:', response.txHash);

    return response;
  } catch (error) {
    console.error('Error minting license:', error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const usage = `
Usage: npx ts-node scripts/mintLicenseToken.ts <ipId> <licenseType>

Arguments:
  ipId          The ID of the IP asset to license
  licenseType   The type of license to mint (upfront or revenue)

Example:
  npx ts-node scripts/mintLicenseToken.ts 0x1234...5678 upfront
  npx ts-node scripts/mintLicenseToken.ts 0x1234...5678 revenue
`;

  if (args.length !== 2 || args.includes('--help')) {
    console.log(usage);
    process.exit(1);
  }

  const [ipId, licenseType] = args;
  
  if (!['upfront', 'revenue'].includes(licenseType)) {
    console.error('Error: licenseType must be either "upfront" or "revenue"');
    console.log(usage);
    process.exit(1);
  }

  return {
    ipId,
    licenseType: licenseType as LicenseType
  };
}

// Run if called directly
if (require.main === module) {
  const params = parseArgs();
  mintLicense(params).catch(console.error);
}
