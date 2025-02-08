require('dotenv').config();
const { privateKeyToAccount } = require('viem/accounts');

const pk = process.env.WALLET_PRIVATE_KEY;
if (!pk) {
    console.error('No private key found in .env file');
    process.exit(1);
}

// Ensure private key is in correct format (0x followed by 64 hex characters)
const cleanPk = pk.toLowerCase().replace('0x', '').padStart(64, '0');
const formattedPk = `0x${cleanPk}`;

try {
    const account = privateKeyToAccount(formattedPk);
    console.log('\nYour wallet address:', account.address);
    console.log('\nTo get testnet ETH:');
    console.log('1. Go to https://faucet.story.xyz/');
    console.log('2. Connect your wallet');
    console.log('3. Request testnet ETH');
    console.log('\nAfter getting testnet ETH, we can create your NFT collection and register 3D models.');
} catch (error) {
    console.error('Error with private key:', error.message);
    console.error('Please make sure your WALLET_PRIVATE_KEY in .env is a valid Ethereum private key');
}
