import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http, createPublicClient, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { type Address } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

async function checkMerc20Balance() {
  try {
    // Setup wallet
    const rawPrivateKey = process.env.WALLET_PRIVATE_KEY || '';
    const privateKey = `0x${rawPrivateKey.toLowerCase().padStart(64, '0')}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    // Create public client
    const publicClient = createPublicClient({
      transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io'),
    });

    // MERC20 token address
    const MERC20_TOKEN = '0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E' as Address;

    console.log('\nWallet Information:');
    console.log('Address:', account.address);

    // Get MERC20 balance
    const balance = await publicClient.readContract({
      address: MERC20_TOKEN,
      abi: [{
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      }],
      functionName: 'balanceOf',
      args: [account.address],
    });

    console.log('\nMERC20 Token Balance:');
    console.log('Balance:', balance.toString(), 'wei');
    console.log('Balance in MERC20:', formatEther(balance));

  } catch (error) {
    console.error('Error checking MERC20 balance:', error);
  }
}

// Run the check
checkMerc20Balance();
