import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http, createPublicClient, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { type Address } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

async function approveMerc20() {
  try {
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

    // MERC20 token address
    const MERC20_TOKEN = '0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E' as Address;
    const SPG_NFT_CONTRACT = process.env.SPG_NFT_CONTRACT_ADDRESS as Address;

    console.log('Approving MERC20 token for spending...');
    
    // Approve a large amount for future transactions
    const response = await client.erc20.approve({
      token: MERC20_TOKEN,
      spender: SPG_NFT_CONTRACT,
      amount: parseEther('1000'), // Approve 1000 MERC20 tokens
      txOptions: { waitForTransaction: true },
    });

    console.log('\nMERC20 token approved successfully!');
    console.log('Transaction Hash:', response.txHash);

  } catch (error) {
    console.error('Error approving MERC20 token:', error);
  }
}

// Run the approval
approveMerc20();
