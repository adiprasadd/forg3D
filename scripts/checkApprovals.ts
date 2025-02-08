import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http, createPublicClient, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { type Address } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

async function checkApprovals() {
  try {
    // Setup wallet
    const rawPrivateKey = process.env.WALLET_PRIVATE_KEY || '';
    const privateKey = `0x${rawPrivateKey.toLowerCase().padStart(64, '0')}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    // Create public client
    const publicClient = createPublicClient({
      transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io'),
    });

    // Addresses
    const MERC20_TOKEN = '0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E' as Address;
    const SPG_NFT_CONTRACT = process.env.SPG_NFT_CONTRACT_ADDRESS as Address;

    console.log('\nWallet Information:');
    console.log('Address:', account.address);

    // Get balance using public client
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

    // Get allowance using public client
    const allowance = await publicClient.readContract({
      address: MERC20_TOKEN,
      abi: [{
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' }
        ],
        outputs: [{ name: '', type: 'uint256' }],
      }],
      functionName: 'allowance',
      args: [account.address, SPG_NFT_CONTRACT],
    });

    console.log('\nMERC20 Token Status:');
    console.log('Balance:', balance.toString(), 'wei');
    console.log('Balance in MERC20:', formatEther(balance));
    console.log('\nAllowance for SPG NFT Contract:');
    console.log('Allowance:', allowance.toString(), 'wei');
    console.log('Allowance in MERC20:', formatEther(allowance));

  } catch (error) {
    console.error('Error checking approvals:', error);
  }
}

// Run the check
checkApprovals();
