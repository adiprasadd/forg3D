import { StoryClient, WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { zeroAddress } from "viem";

interface PayRoyaltyParams {
  receiverIpId: `0x${string}`;
  payerIpId?: `0x${string}`;
  amount: bigint;
}

export async function payRoyalty(
  client: StoryClient,
  params: PayRoyaltyParams
) {
  try {
    const response = await client.royalty.payRoyaltyOnBehalf({
      receiverIpId: params.receiverIpId,
      payerIpId: params.payerIpId || zeroAddress,
      token: WIP_TOKEN_ADDRESS,
      amount: params.amount,
      txOptions: { waitForTransaction: true },
    });

    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error("Error paying royalty:", error);
    throw error;
  }
}
