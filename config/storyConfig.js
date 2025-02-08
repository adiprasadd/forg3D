const { StoryClient } = require('@story-protocol/core-sdk');
require('dotenv').config();

// Initialize Story Protocol client
const initStoryClient = () => {
    // Check for required environment variables
    if (!process.env.STORY_API_KEY) {
        throw new Error('STORY_API_KEY is required in .env file');
    }
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error('WALLET_PRIVATE_KEY is required in .env file');
    }

    // Create Story Protocol client configuration
    const config = {
        chainId: process.env.NEXT_PUBLIC_STORY_CHAIN_ID || 'aeneid',
        rpcProvider: process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io',
        apiKey: process.env.STORY_API_KEY,
        privateKey: process.env.WALLET_PRIVATE_KEY,
    };

    // Initialize Story Protocol client
    try {
        const client = StoryClient.newClient(config);
        console.log('Story Protocol client initialized successfully');
        return client;
    } catch (error) {
        console.error('Failed to initialize Story Protocol client:', error);
        throw error;
    }
};

module.exports = {
    initStoryClient,
};
