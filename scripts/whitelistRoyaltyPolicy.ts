import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createPublicClient, createWalletClient, type Address } from 'viem';
import { aeneid } from '@story-protocol/core-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Setup Story Protocol client
const rawPrivateKey = process.env.WALLET_PRIVATE_KEY || '';
const privateKey = `0x${rawPrivateKey.toLowerCase().padStart(64, '0')}` as `0x${string}`;
const account = privateKeyToAccount(privateKey);

// Create Viem clients
const transport = http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io');
const publicClient = createPublicClient({
  chain: aeneid,
  transport,
});

const walletClient = createWalletClient({
  chain: aeneid,
  transport,
  account,
});

// ABI for the RoyaltyPolicyLAP contract
const abi = parseAbi([
  'function setRoyaltyPolicyWhitelisted(address policy, bool whitelisted) external',
]);

async function whitelistRoyaltyPolicy() {
  try {
    console.log("Whitelisting royalty policy...");
    
    const policyAddress = '0x937bef10ba6fb941ed84b8d249abc76031429a9a';
    const registryAddress = '0x4fd53af359BB613F9f001d7aA1E2f3a3aD814282';

    const { request } = await publicClient.simulateContract({
      address: registryAddress,
      abi,
      functionName: 'setRoyaltyPolicyWhitelisted',
      args: [policyAddress, true],
      account,
    });

    const hash = await walletClient.writeContract(request);
    
    console.log("\nRoyalty Policy whitelisted successfully!");
    console.log("Transaction Hash:", hash);
    
  } catch (error) {
    console.error("Error whitelisting royalty policy:", error);
  }
}

// Run the script
whitelistRoyaltyPolicy();
