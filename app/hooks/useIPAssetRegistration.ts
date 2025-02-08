"use client";

import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { toHex, Address, zeroAddress } from "viem";
import { LicenseTerms, LicensingConfig } from "@story-protocol/core-sdk";

interface RegisterIPAssetParams {
  name: string;
  description: string;
  mediaUrl: string;
  type: string;
}

export function useIPAssetRegistration() {
  const { client, isInitialized } = useStoryProtocol();
  const [isRegistering, setIsRegistering] = useState(false);

  const createCollection = async (name: string) => {
    if (!client || !isInitialized) {
      throw new Error("Story Protocol client not initialized");
    }

    const collection = await client.nftClient.createNFTCollection({
      name: `${name} Collection`,
      symbol: "3DM",
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: "",
      txOptions: { waitForTransaction: true },
    });

    return collection.spgNftContract as Address;
  };

  const registerIPAsset = async ({
    name,
    description,
    mediaUrl,
    type,
  }: RegisterIPAssetParams) => {
    if (!client || !isInitialized) {
      throw new Error("Story Protocol client not initialized");
    }

    try {
      setIsRegistering(true);

      // First create a collection for the model
      const spgNftContract = await createCollection(name);

      // Create license terms for the model
      const terms: LicenseTerms = {
        transferable: true,
        royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E", // RoyaltyPolicyLAP address
        defaultMintingFee: BigInt(0),
        expiration: BigInt(0),
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: "0x",
        commercialRevShare: 10, // 10% revenue share
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: BigInt(0),
        currency: "0x1514000000000000000000000000000000000000", // WIP token address
        uri: "",
      };

      const licensingConfig: LicensingConfig = {
        isSet: false,
        mintingFee: BigInt(0),
        licensingHook: zeroAddress,
        hookData: "0x",
        commercialRevShare: 0,
        disabled: false,
        expectMinimumGroupRewardShare: 0,
        expectGroupRewardPool: zeroAddress,
      };

      // Register IP Asset with metadata and license terms
      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract,
        allowDuplicates: true,
        licenseTermsData: [{ terms, licensingConfig }],
        ipMetadata: {
          ipMetadataURI: mediaUrl,
          ipMetadataHash: toHex(mediaUrl, { size: 32 }),
          nftMetadataHash: toHex(`${name}-metadata`, { size: 32 }),
          nftMetadataURI: mediaUrl,
        },
        txOptions: { waitForTransaction: true },
      });

      console.log("IP Asset registered:", {
        txHash: response.txHash,
        tokenId: response.tokenId,
        ipId: response.ipId,
        licenseTermsId: response.licenseTermsId,
      });

      return response.ipId;
    } catch (error) {
      console.error("IP Asset registration error:", error);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  return { registerIPAsset, isRegistering };
}
