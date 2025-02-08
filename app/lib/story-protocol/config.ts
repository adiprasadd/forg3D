import { Address } from "viem";
import { StoryConfig } from "@story-protocol/core-sdk";
import { http } from "viem";
import { Account } from "viem/accounts";

// Environment variables should be properly typed
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_RPC_PROVIDER_URL: string;
      NEXT_PUBLIC_STORY_CHAIN_ID: string;
      NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: string;
      NEXT_PUBLIC_SPG_NFT_CONTRACT_ADDRESS: string;
    }
  }
}

export const STORY_PROTOCOL_CONFIG = {
  RPCProviderUrl:
    process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || "https://aeneid.storyrpc.io",
  NFTContractAddress:
    (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address) ||
    "0x937bef10ba6fb941ed84b8d249abc76031429a9a",
  SPGNFTContractAddress: process.env
    .NEXT_PUBLIC_SPG_NFT_CONTRACT_ADDRESS as Address,
  RoyaltyPolicyLAP: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E" as Address,
} as const;

export const NonCommercialSocialRemixingTermsId = "1";

export const getStoryConfig = (account: Account | null): StoryConfig => {
  if (!account) {
    throw new Error("Account is required for Story Protocol configuration");
  }

  return {
    account,
    transport: http(STORY_PROTOCOL_CONFIG.RPCProviderUrl),
    chainId: "aeneid",
  };
};
