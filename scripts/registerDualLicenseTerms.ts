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

async function registerDualLicenseTerms() {
  try {
    console.log('Registering dual license terms...');

    // Register upfront-only commercial use license
    console.log('\nRegistering upfront-only commercial use license...');
    const upfrontResponse = await client.license.registerCommercialUsePIL({
      currency: WIP_TOKEN,
      defaultMintingFee: BigInt('10000000000000000000'), // 10 WIP tokens
      txOptions: { waitForTransaction: true }
    });

    console.log('Upfront-only license terms registered:');
    console.log('License Terms ID:', upfrontResponse.licenseTermsId);
    console.log('Transaction Hash:', upfrontResponse.txHash);

    // Register revenue-share commercial remix license
    console.log('\nRegistering revenue-share commercial remix license...');
    const revenueShareResponse = await client.license.registerCommercialRemixPIL({
      currency: WIP_TOKEN,
      defaultMintingFee: BigInt('5000000000000000000'), // 5 WIP tokens
      commercialRevShare: 30, // 30% revenue share
      txOptions: { waitForTransaction: true }
    });

    console.log('Revenue-share license terms registered:');
    console.log('License Terms ID:', revenueShareResponse.licenseTermsId);
    console.log('Transaction Hash:', revenueShareResponse.txHash);

    return {
      upfrontLicenseId: upfrontResponse.licenseTermsId,
      revenueShareLicenseId: revenueShareResponse.licenseTermsId
    };
  } catch (error) {
    console.error('Error registering license terms:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  registerDualLicenseTerms().catch(console.error);
}
