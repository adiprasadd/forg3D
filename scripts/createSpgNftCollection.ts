import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { zeroAddress } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

async function createSpgNftCollection() {
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

    console.log('Creating SPG NFT collection...');
    
    const response = await client.nftClient.createNFTCollection({
      name: '3D Models Marketplace',
      symbol: '3DM',
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: '',
      txOptions: { waitForTransaction: true },
    });

    console.log('\nSPG NFT Collection created successfully!');
    console.log('Transaction Hash:', response.txHash);
    console.log('NFT Contract Address:', response.spgNftContract);
    console.log('\nAdd this to your .env file:');
    console.log(`SPG_NFT_CONTRACT_ADDRESS=${response.spgNftContract}`);

  } catch (error) {
    console.error('Error creating SPG NFT collection:', error);
  }
}

// Run the collection creation
createSpgNftCollection();
