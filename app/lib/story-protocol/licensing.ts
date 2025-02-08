import { LicenseTerms, WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { Address, zeroAddress, zeroHash } from "viem";
import { STORY_PROTOCOL_CONFIG } from "./config";
import type { CommercialTerms } from "./types";

export function createCommercialRemixTerms(
  terms: CommercialTerms
): LicenseTerms {
  return {
    transferable: true,
    royaltyPolicy: STORY_PROTOCOL_CONFIG.RoyaltyPolicyLAP,
    defaultMintingFee: BigInt(terms.defaultMintingFee),
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: zeroAddress,
    commercialRevShare: terms.commercialRevShare,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: WIP_TOKEN_ADDRESS,
    uri: "",
  };
}

export const defaultLicensingConfig = {
  isSet: false,
  mintingFee: BigInt(0),
  licensingHook: zeroAddress,
  hookData: zeroHash,
  commercialRevShare: 0,
  disabled: false,
  expectMinimumGroupRewardShare: 0,
  expectGroupRewardPool: zeroAddress,
};
