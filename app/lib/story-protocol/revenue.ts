import { StoryClient, WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { STORY_PROTOCOL_CONFIG } from "./config";

interface ClaimRevenueParams {
  ancestorIpId: `0x${string}`;
  claimer: `0x${string}`;
  childIpIds?: `0x${string}`[];
  royaltyPolicies?: `0x${string}`[];
}

export async function claimRevenue(
  client: StoryClient,
  params: ClaimRevenueParams
) {
  try {
    const response = await client.royalty.claimAllRevenue({
      ancestorIpId: params.ancestorIpId,
      claimer: params.claimer,
      currencyTokens: [WIP_TOKEN_ADDRESS],
      childIpIds: params.childIpIds || [],
      royaltyPolicies: params.royaltyPolicies || [
        STORY_PROTOCOL_CONFIG.RoyaltyPolicyLAP,
      ],
      txOptions: { waitForTransaction: true },
    });

    return {
      success: true,
      txHash: response.txHash,
      claimedTokens: response.claimedTokens,
    };
  } catch (error) {
    console.error("Error claiming revenue:", error);
    throw error;
  }
}

export async function getClaimableRevenue(
  client: StoryClient,
  params: ClaimRevenueParams
) {
  try {
    const claimable = await client.royalty.getClaimableRevenue({
      ancestorIpId: params.ancestorIpId,
      claimer: params.claimer,
      currencyTokens: [WIP_TOKEN_ADDRESS],
      childIpIds: params.childIpIds || [],
      royaltyPolicies: params.royaltyPolicies || [
        STORY_PROTOCOL_CONFIG.RoyaltyPolicyLAP,
      ],
    });

    return claimable;
  } catch (error) {
    console.error("Error getting claimable revenue:", error);
    throw error;
  }
}
