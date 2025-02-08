const { StoryClient } = require('@story-protocol/core-sdk')
const { http } = require('viem')
const { privateKeyToAccount } = require('viem/accounts')

const privateKey = `0x${process.env.WALLET_PRIVATE_KEY}`
const account = privateKeyToAccount(privateKey)

const config = {  
  account: account,  
  transport: http(process.env.RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io'),  
  chainId: 'aeneid',  
}  

const client = StoryClient.newClient(config)

module.exports = {
  client,
  account
}