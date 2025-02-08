const { zeroAddress } = require('viem');
const { client } = require('./utils');

async function createSpgNftCollection() {
  try {
    const newCollection = await client.nftClient.createNFTCollection({
      name: '3D Models Marketplace',
      symbol: '3DM',
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: '',
      txOptions: { waitForTransaction: true },
    });

    console.log(`New SPG NFT collection created at transaction hash ${newCollection.txHash}`);
    console.log(`NFT contract address: ${newCollection.spgNftContract}`);
  } catch (error) {
    console.error('Error creating collection:', error);
  }
}

createSpgNftCollection();
