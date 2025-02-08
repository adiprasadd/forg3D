import { StoryClient } from "@story-protocol/core-sdk";
import { config } from "dotenv";
import { Address } from "viem";
import { getStoryConfig } from "../app/lib/story-protocol/config";
import { getWalletAccount } from "../app/lib/story-protocol/wallet";

config();

const WIP_TOKEN = "0x1514000000000000000000000000000000000000" as Address;

async function payRoyalty(
  receiverIpId: Address,
  payerIpId: Address,
  amount: bigint
) {
  try {
    console.log(`Paying royalty...`);
    console.log(`From IP: ${payerIpId}`);
    console.log(`To IP: ${receiverIpId}`);
    console.log(`Amount: ${amount} WIP tokens`);

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("WALLET_PRIVATE_KEY not found in environment");
    }

    const wallet = getWalletAccount(privateKey);
    if (!wallet) {
      throw new Error("Failed to create wallet account");
    }

    const storyConfig = getStoryConfig(wallet);
    const client = StoryClient.newClient(storyConfig);
    
    const response = await client.royalty.payRoyaltyOnBehalf({
      receiverIpId,
      payerIpId,
      token: WIP_TOKEN,
      amount,
      txOptions: { waitForTransaction: true }
    });

    if (response.txHash) {
      console.log(`✅ Royalty payment successful!`);
      console.log(`Transaction hash: ${response.txHash}`);
      return response;
    } else {
      console.log(`❌ No transaction hash received`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error paying royalty:`, error);
    throw error;
  }
}

// Example usage
async function main() {
  if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
    console.log("Usage: ts-node handleRoyalty.ts <receiverIpId> <payerIpId> <amountInWIP>");
    process.exit(1);
  }

  const receiverIpId = process.argv[2] as Address;
  const payerIpId = process.argv[3] as Address;
  const amount = BigInt(process.argv[4]);

  try {
    await payRoyalty(receiverIpId, payerIpId, amount);
  } catch (error) {
    console.error("Failed to pay royalty:", error);
    process.exit(1);
  }
}

main();
