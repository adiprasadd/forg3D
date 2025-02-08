import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http, createPublicClient, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { type Address } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

async function checkWipBalance() {
  try {
    // Setup wallet
    const rawPrivateKey = process.env.WALLET_PRIVATE_KEY || '';
    const privateKey = `0x${rawPrivateKey.toLowerCase().padStart(64, '0')}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    // Create public client
    const publicClient = createPublicClient({
      transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io'),
    });

    // WIP token address
    const WIP_TOKEN = '0x1514000000000000000000000000000000000000' as Address;

    console.log('\nWallet Information:');
    console.log('Address:', account.address);

    // Get WIP balance
    const balance = await publicClient.readContract({
      address: WIP_TOKEN,
      abi: [
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: 'balance', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'balanceOf',
      args: [account.address],
    });

    console.log('\nWIP Token Balance:');
    console.log('Balance:', balance.toString(), 'wei');
    console.log('Balance in WIP:', formatEther(balance));

  } catch (error) {
    console.error('Error checking WIP balance:', error);
  }
}

// Run the check
checkWipBalance();
