import { Address } from "viem";
import { LicenseTerms } from "@story-protocol/core-sdk";

export interface IPAssetMetadata {
  name: string;
  description: string;
  mediaUrl: string;
}

export interface CommercialTerms {
  commercialRevShare: number;
  defaultMintingFee: number;
}

export interface StoryProtocolConfig {
  RPCProviderUrl: string;
  NFTContractAddress: Address;
  SPGNFTContractAddress: Address;
  RoyaltyPolicyLAP: Address;
}
