import dotenv from 'dotenv';

dotenv.config();

function verifyPrivateKey() {
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  
  console.log('Private Key Verification:');
  console.log('------------------------');
  
  if (!privateKey) {
    console.log('❌ WALLET_PRIVATE_KEY is not set in .env file');
    return;
  }

  // Check length
  console.log(`Length: ${privateKey.length} characters`);
  console.log(`Length check: ${privateKey.length === 64 ? '✅' : '❌'} (should be 64)`);
  
  // Check for 0x prefix
  console.log(`No 0x prefix: ${!privateKey.startsWith('0x') ? '✅' : '❌'}`);
  
  // Check for valid hex characters
  const validHex = /^[0-9a-fA-F]+$/.test(privateKey);
  console.log(`Valid hex characters: ${validHex ? '✅' : '❌'}`);
  
  // Check for any whitespace
  const hasWhitespace = /\s/.test(privateKey);
  console.log(`No whitespace: ${!hasWhitespace ? '✅' : '❌'}`);
  
  if (privateKey.length !== 64) {
    console.log('\nIssue: Private key must be exactly 64 characters');
  }
  if (privateKey.startsWith('0x')) {
    console.log('\nIssue: Remove the "0x" prefix from your private key');
  }
  if (!validHex) {
    console.log('\nIssue: Private key contains invalid characters. Only use 0-9 and a-f');
  }
  if (hasWhitespace) {
    console.log('\nIssue: Private key contains whitespace. Remove any spaces or newlines');
  }
}

verifyPrivateKey();
