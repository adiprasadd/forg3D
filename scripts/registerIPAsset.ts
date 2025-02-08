import { StoryClient } from '@story-protocol/core-sdk';
import { toHex, Address, zeroAddress, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { config } from 'dotenv';

config();

const initStoryClient = () => {
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error('Missing required environment variables');
    }

    const privateKey = `0x${process.env.WALLET_PRIVATE_KEY.toLowerCase().padStart(64, '0')}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    const transport = http(process.env.RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io');
    const publicClient = createPublicClient({ transport });

    return StoryClient.newClient({
        account,
        transport,
        chainId: 'aeneid',
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

        console.log('IP Asset registered:', response);
        return response;
    } catch (error) {
        console.error('Error creating and registering IP asset:', error);
        throw error;
    }
}

async function registerExistingNFT(nftContract: Address, tokenId: string) {
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

        console.log('IP Asset registered:', response);
        return response;
    } catch (error) {
        console.error('Error registering existing NFT:', error);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        await createAndRegisterIPAsset();
    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

main();
