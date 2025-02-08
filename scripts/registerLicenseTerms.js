const { client } = require('./utils');

async function registerModelLicenseTerms() {
  try {
    // Register commercial remix license for 3D models
    const commercialRemixParams = {
      // Using WIP token as currency
      currency: '0x1514000000000000000000000000000000000000',
      // Set default minting fee to 10 WIP tokens
      defaultMintingFee: '10',
      // Original creator gets 15% of revenue from commercial use
      commercialRevShare: 15,
      // Allow derivatives with attribution
      derivativesAllowed: true,
      derivativesAttribution: true,
      // Set a reasonable revenue ceiling for derivatives (100,000 WIP)
      derivativeRevCeiling: BigInt('100000000000000000000000'),
      // Add URI for license terms metadata
      uri: 'https://your-marketplace/license-terms',
    };

    const response = await client.license.registerCommercialRemixPIL({
      ...commercialRemixParams,
      txOptions: { waitForTransaction: true }
    });

    console.log(`License Terms registered successfully!`);
    console.log(`Transaction Hash: ${response.txHash}`);
    console.log(`License Terms ID: ${response.licenseTermsId}`);

    // Store the license terms ID for future use
    return response.licenseTermsId;
  } catch (error) {
    console.error('Error registering license terms:', error);
    throw error;
  }
}

// Export for use in other files
module.exports = {
  registerModelLicenseTerms
};

// If running directly, execute the registration
if (require.main === module) {
  registerModelLicenseTerms()
    .then(licenseTermsId => {
      console.log('Successfully registered license terms. Add this to your .env file:');
      console.log(`LICENSE_TERMS_ID=${licenseTermsId}`);
    })
    .catch(console.error);
}
