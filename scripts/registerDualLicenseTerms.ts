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
const WIP_TOKEN = '0x1514000000000000000000000000000000000000';

interface DualLicenseTermsParams {
  ipId: Address;
  upfrontFee?: bigint;  // Optional, defaults to 10 WIP
  revenueFee?: bigint;  // Optional, defaults to 5 WIP
  revenueShare?: number;  // Optional, defaults to 30%
  currency?: Address;  // Optional, defaults to WIP_TOKEN
}

async function registerDualLicenseTerms(params: DualLicenseTermsParams) {
  try {
    console.log('Registering dual license terms...');
    const currency = params.currency || WIP_TOKEN;
    const upfrontFee = params.upfrontFee || BigInt('10000000000000000000'); // 10 WIP tokens
    const revenueFee = params.revenueFee || BigInt('5000000000000000000'); // 5 WIP tokens
    const revenueShare = params.revenueShare || 30; // 30%

    // Register upfront-only commercial use license
    console.log('\nRegistering upfront-only commercial use license...');
    const upfrontResponse = await client.license.registerCommercialUsePIL({
      currency,
      defaultMintingFee: upfrontFee,
      txOptions: { waitForTransaction: true }
    });

    console.log('Upfront-only license terms registered:');
    console.log('License Terms ID:', upfrontResponse.licenseTermsId);
    console.log('Transaction Hash:', upfrontResponse.txHash);

    // Register revenue-share commercial remix license
    console.log('\nRegistering revenue-share commercial remix license...');
    const revenueShareResponse = await client.license.registerCommercialRemixPIL({
      currency,
      defaultMintingFee: revenueFee,
      commercialRevShare: revenueShare,
      txOptions: { waitForTransaction: true }
    });

    console.log('Revenue-share license terms registered:');
    console.log('License Terms ID:', revenueShareResponse.licenseTermsId);
    console.log('Transaction Hash:', revenueShareResponse.txHash);

    // Attach both license terms to the IP asset
    console.log('\nAttaching license terms to IP asset...');
    
    // Attach upfront license
    console.log('Attaching upfront license...');
    const attachUpfrontResponse = await client.license.attachLicenseTerms({
      ipId: params.ipId,
      licenseTermsId: upfrontResponse.licenseTermsId as bigint,
      txOptions: { waitForTransaction: true }
    });
    console.log('Upfront license attached:', attachUpfrontResponse.txHash);

    // Attach revenue-share license
    console.log('Attaching revenue-share license...');
    const attachRevShareResponse = await client.license.attachLicenseTerms({
      ipId: params.ipId,
      licenseTermsId: revenueShareResponse.licenseTermsId as bigint,
      txOptions: { waitForTransaction: true }
    });
    console.log('Revenue-share license attached:', attachRevShareResponse.txHash);

    return {
      upfrontLicenseId: upfrontResponse.licenseTermsId,
      revenueLicenseId: revenueShareResponse.licenseTermsId,
      upfrontAttachTx: attachUpfrontResponse.txHash,
      revenueAttachTx: attachRevShareResponse.txHash
    };
  } catch (error) {
    console.error('Error registering license terms:', error);
    throw error;
  }
}

// Example usage when running directly
if (require.main === module) {
  // You would need to provide the IP asset ID when running the script
  const ipId = process.env.IP_ASSET_ID;
  if (!ipId) {
    console.error('Please provide IP_ASSET_ID in environment variables');
    process.exit(1);
  }
  registerDualLicenseTerms({ ipId: ipId as Address }).catch(console.error);
}

export { registerDualLicenseTerms, type DualLicenseTermsParams };
