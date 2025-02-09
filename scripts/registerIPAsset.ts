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

async function createAndRegisterIPAsset(name: string, description: string, metadataUri: string): Promise<`0x${string}`> {
    try {
        const client = initStoryClient();

        // First, create a new NFT collection
        console.log('Creating new NFT collection...');
        const newCollection = await client.nftClient.createNFTCollection({
            name: name + ' Collection',
            symbol: name.substring(0, 5).toUpperCase(),
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
                ipMetadataURI: metadataUri,
                ipMetadataHash: toHex(description, { size: 32 }),
            },
            txOptions: { waitForTransaction: true },
        });

        console.log('IP Asset registered:', response);
        if (!response.ipId) {
            throw new Error('No IP ID returned from registration');
        }
        return response.ipId;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const usage = `
Usage: npx ts-node scripts/registerIPAsset.ts <name> <description> <metadataUri>

Arguments:
  name          Name of the IP asset
  description   Description of the IP asset
  metadataUri   URI of the IP asset metadata

Example:
  npx ts-node scripts/registerIPAsset.ts "My IP Asset" "A description" "https://example.com/metadata.json"
`;

    if (args.length !== 3 || args.includes('--help')) {
        console.log(usage);
        process.exit(1);
    }

    return {
        name: args[0],
        description: args[1],
        metadataUri: args[2]
    };
}

// Run if called directly
if (require.main === module) {
    const { name, description, metadataUri } = parseArgs();
    createAndRegisterIPAsset(name, description, metadataUri)
        .then(ipId => {
            // Just output the IP ID by itself so it can be captured by scripts
            console.log(ipId);
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

export { createAndRegisterIPAsset };
