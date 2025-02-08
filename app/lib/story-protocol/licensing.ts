import { LicenseTerms, WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { Address, zeroAddress, zeroHash } from "viem";
import { STORY_PROTOCOL_CONFIG } from "./config";
import type { CommercialTerms } from "./types";
import { StoryClient } from "@story-protocol/core-sdk";

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

export interface LicenseTerms {
  type: string;
  commercial: boolean;
  modifications: boolean;
  attribution: boolean;
  territory: string;
  duration: number; // in seconds
}

export async function createLicense(
  client: StoryClient,
  ipAssetId: string,
  terms: LicenseTerms
) {
  try {
    const license = await client.licensing.create({
      ipAssetId,
      terms: {
        commercial: terms.commercial,
        modifications: terms.modifications,
        attribution: terms.attribution,
        territory: terms.territory,
        duration: terms.duration,
        licenseType: terms.type,
      },
    });

    return license;
  } catch (error) {
    console.error("Error creating license:", error);
    throw error;
  }
}

export async function verifyLicense(client: StoryClient, licenseId: string) {
  try {
    const isValid = await client.licensing.verify(licenseId);
    return isValid;
  } catch (error) {
    console.error("Error verifying license:", error);
    throw error;
  }
}

export async function getLicenseTerms(client: StoryClient, licenseId: string) {
  try {
    const terms = await client.licensing.getTerms(licenseId);
    return terms;
  } catch (error) {
    console.error("Error getting license terms:", error);
    throw error;
  }
}
