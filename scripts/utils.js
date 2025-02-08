const { StoryClient } = require('@story-protocol/core-sdk');
const { http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

require('dotenv').config();

// Ensure private key is lowercase and exactly 64 characters (32 bytes)
const rawPrivateKey = process.env.WALLET_PRIVATE_KEY || '';
const privateKey = rawPrivateKey.toLowerCase().padStart(64, '0');
const account = privateKeyToAccount(`0x${privateKey}`);

const config = {
  account,
  transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io'),
  chainId: process.env.NEXT_PUBLIC_STORY_CHAIN_ID || 'aeneid',
};

const client = StoryClient.newClient(config);

module.exports = {
  client,
  account,
};
