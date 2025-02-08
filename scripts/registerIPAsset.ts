import { StoryClient } from '@story-protocol/core-sdk';
import { toHex, Address, zeroAddress } from 'viem';
import { config } from 'dotenv';

config();

const initStoryClient = () => {
    if (!process.env.STORY_API_KEY || !process.env.WALLET_PRIVATE_KEY) {
        throw new Error('Missing required environment variables');
    }

    return StoryClient.newClient({
        chainId: process.env.NEXT_PUBLIC_STORY_CHAIN_ID || 'aeneid',
        rpcProvider: process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io',
        apiKey: process.env.STORY_API_KEY,
        privateKey: process.env.WALLET_PRIVATE_KEY,
    });
};

async function createAndRegisterIPAsset() {
    try {
        const client = initStoryClient();

        // First, create a new NFT collection
        console.log('Creating new NFT collection...');
        const newCollection = await client.nftClient.createNFTCollection({
            name: '3D Model Collection',
            symbol: '3DMDL',
            isPublicMinting: true,
            mintOpen: true,
            mintFeeRecipient: zeroAddress,
            contractURI: '',
            txOptions: { waitForTransaction: true },
        });

        console.log('NFT Collection created:', newCollection);

        // Now mint and register an IP asset
        console.log('Minting and registering IP asset...');
        const response = await client.ipAsset.mintAndRegisterIp({
            spgNftContract: newCollection.spgNftContract as Address,
            allowDuplicates: true,
            ipMetadata: {
                ipMetadataURI: 'https://your-metadata-uri.com/model1',
                ipMetadataHash: toHex('model-metadata-hash', { size: 32 }),
                nftMetadataHash: toHex('model-nft-metadata-hash', { size: 32 }),
                nftMetadataURI: 'https://your-metadata-uri.com/model1/nft',
            },
            txOptions: { waitForTransaction: true }
        });

        console.log(`IP Asset created successfully!`);
        console.log(`Transaction Hash: ${response.txHash}`);
        console.log(`NFT Token ID: ${response.tokenId}`);
        
        return response;
    } catch (error) {
        console.error('Error creating and registering IP asset:', error);
        throw error;
    }
}

async function registerExistingNFT(nftContract: string, tokenId: string) {
    try {
        const client = initStoryClient();

        console.log('Registering existing NFT as IP asset...');
        const response = await client.ipAsset.register({
            nftContract,
            tokenId,
            ipMetadata: {
                ipMetadataURI: 'https://your-metadata-uri.com/model1',
                ipMetadataHash: toHex('model-metadata-hash', { size: 32 }),
                nftMetadataHash: toHex('model-nft-metadata-hash', { size: 32 }),
                nftMetadataURI: 'https://your-metadata-uri.com/model1/nft',
            },
            txOptions: { waitForTransaction: true }
        });

        console.log(`IP Asset registered successfully!`);
        console.log(`Transaction Hash: ${response.txHash}`);
        console.log(`IP Asset ID: ${response.ipId}`);
        
        return response;
    } catch (error) {
        console.error('Error registering existing NFT:', error);
        throw error;
    }
}

// Example usage
async function main() {
    // To create new NFT and register as IP Asset
    await createAndRegisterIPAsset();

    // To register an existing NFT (uncomment and provide values)
    /*
    await registerExistingNFT(
        "0x041B4F29183317Fd352AE57e331154b73F8a1D73", // NFT contract address
        "12" // token ID
    );
    */
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
