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

interface DualLicenseTermsParams {
  ipId: string;
  currency?: Address;
  upfrontFee?: bigint;
  revenueFee?: bigint;
  revenueShare?: number;
}

async function registerDualLicenseTerms(params: DualLicenseTermsParams) {
  try {
    console.log('Registering dual license terms...');
    const currency = params.currency || WIP_TOKEN;
    const upfrontFee = params.upfrontFee; // 10 WIP tokens
    const revenueFee = params.revenueFee; // 5 WIP tokens
    const revenueShare = params.revenueShare; // 30%

    // Register upfront-only commercial use license
    console.log('\nRegistering upfront-only commercial use license...');
    const upfrontResponse = await client.license.registerCommercialUsePIL({
      currency,
      defaultMintingFee: upfrontFee || '10',
      txOptions: { waitForTransaction: true }
    });

    console.log('Upfront license registered:', upfrontResponse);

    // Register revenue-share commercial remix license
    console.log('\nRegistering revenue-share commercial remix license...');
    const revenueShareResponse = await client.license.registerCommercialRemixPIL({
      currency,
      defaultMintingFee: revenueFee || '5',
      commercialRevShare: revenueShare || 30,
      txOptions: { waitForTransaction: true }
    });

    console.log('Revenue share license registered:', revenueShareResponse);

    // Attach both licenses to the IP asset
    console.log('\nAttaching licenses to IP asset...');
    
    if (!upfrontResponse.licenseTermsId || !revenueShareResponse.licenseTermsId) {
      throw new Error('License terms IDs not returned from registration');
    }

    await client.license.attachLicenseTerms({
      ipId: params.ipId as Address,
      licenseTermsId: upfrontResponse.licenseTermsId as bigint,
      txOptions: { waitForTransaction: true }
    });

    await client.license.attachLicenseTerms({
      ipId: params.ipId as Address,
      licenseTermsId: revenueShareResponse.licenseTermsId as bigint,
      txOptions: { waitForTransaction: true }
    });

    console.log('\nLicense terms attached successfully!');
    console.log('Upfront License Terms ID:', upfrontResponse.licenseTermsId.toString());
    console.log('Revenue Share License Terms ID:', revenueShareResponse.licenseTermsId.toString());

    return {
      upfrontTermsId: upfrontResponse.licenseTermsId,
      revenueTermsId: revenueShareResponse.licenseTermsId
    };
  } catch (error) {
    console.error('Error registering dual license terms:', error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const usage = `
Usage: npx ts-node scripts/registerDualLicenseTerms.ts <ipId>

Arguments:
  ipId    The ID of the IP asset to attach licenses to

Example:
  npx ts-node scripts/registerDualLicenseTerms.ts 0x1234...5678
`;

  if (args.length !== 1 || args.includes('--help')) {
    console.log(usage);
    process.exit(1);
  }

  return {
    ipId: args[0]
  };
}

// Run if called directly
if (require.main === module) {
  const { ipId } = parseArgs();
  registerDualLicenseTerms({ ipId }).catch(console.error);
}

export { registerDualLicenseTerms };
