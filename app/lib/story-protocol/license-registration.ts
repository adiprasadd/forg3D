import {
  LicenseTerms,
  RoyaltyPolicyLAP,
  WIP_TOKEN_ADDRESS,
} from "@story-protocol/core-sdk";
import { zeroAddress } from "viem";
import { StoryClient } from "@story-protocol/core-sdk";

export async function registerCommercialLicense(
  client: StoryClient,
  params: {
    mintingFee: string;
    revShare: number;
    allowRemixing: boolean;
  }
) {
  try {
    if (params.allowRemixing) {
      // Register Commercial Remix License
      const response = await client.license.registerCommercialRemixPIL({
        currency: WIP_TOKEN_ADDRESS,
        defaultMintingFee: params.mintingFee,
        commercialRevShare: params.revShare,
        txOptions: { waitForTransaction: true },
      });
      return response;
    } else {
      // Register Commercial Use License
      const response = await client.license.registerCommercialUsePIL({
        currency: WIP_TOKEN_ADDRESS,
        defaultMintingFee: params.mintingFee,
        txOptions: { waitForTransaction: true },
      });
      return response;
    }
  } catch (error) {
    console.error("Error registering commercial license:", error);
    throw error;
  }
}

export async function registerCustomLicense(
  client: StoryClient,
  params: {
    mintingFee: bigint;
    revShare: number;
    transferable: boolean;
    expiration: bigint;
    commercialUse: boolean;
    derivativesAllowed: boolean;
    attribution: boolean;
  }
) {
  try {
    const licenseTerms: LicenseTerms = {
      defaultMintingFee: params.mintingFee,
      currency: WIP_TOKEN_ADDRESS,
      royaltyPolicy: RoyaltyPolicyLAP,
      transferable: params.transferable,
      expiration: params.expiration,
      commercialUse: params.commercialUse,
      commercialAttribution: params.attribution,
      commercializerChecker: zeroAddress,
      commercializerCheckerData: "0x",
      commercialRevShare: params.revShare,
      commercialRevCeiling: BigInt(0),
      derivativesAllowed: params.derivativesAllowed,
      derivativesAttribution: params.attribution,
      derivativesApproval: false,
      derivativesReciprocal: true,
      derivativeRevCeiling: BigInt(0),
      uri: "",
    };

    const response = await client.license.registerPILTerms({
      ...licenseTerms,
      txOptions: { waitForTransaction: true },
    });

    return response;
  } catch (error) {
    console.error("Error registering custom license:", error);
    throw error;
  }
}

export async function registerNonCommercialLicense(client: StoryClient) {
  try {
    const response = await client.license.registerNonComSocialRemixingPIL({
      txOptions: { waitForTransaction: true },
    });
    return response;
  } catch (error) {
    console.error("Error registering non-commercial license:", error);
    throw error;
  }
}
