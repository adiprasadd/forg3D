const { initStoryClient } = require('../config/storyConfig');

async function main() {
    try {
        // Initialize Story Protocol client
        const client = initStoryClient();
        
        // Get the connected wallet address
        const address = await client.getAddress();
        console.log('Connected wallet address:', address);
        
        // Get the current network
        const network = await client.getNetwork();
        console.log('Connected to network:', network.name);
        
    } catch (error) {
        console.error('Error testing Story Protocol configuration:', error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
