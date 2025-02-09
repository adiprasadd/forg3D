"use client";

import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { useWallet } from "../components/WalletProvider";
import { Address } from "viem";

// WIP token address on Story Protocol
const WIP_TOKEN = "0x1514000000000000000000000000000000000000" as Address;

interface LicenseTermsResponse {
  upfrontTermsId: bigint;
  revenueTermsId: bigint;
  txHashes: string[];
}

interface LicenseTermsParams {
  ipId: string;
  upfrontFee: bigint;
  revenueFee: bigint;
  revenueShare: number;
}

export function useLicenseMinting() {
  const { client, isInitialized } = useStoryProtocol();
  const { address } = useWallet();
  const [isRegistering, setIsRegistering] = useState(false);

  const registerDualLicenseTerms = async (
    params: LicenseTermsParams
  ): Promise<LicenseTermsResponse> => {
    if (!client || !isInitialized || !address) {
      throw new Error("Client not initialized or wallet not connected");
    }

    try {
      setIsRegistering(true);
      console.log("Registering dual license terms...");

      // Register upfront-only commercial use license
      console.log("\nRegistering upfront-only commercial use license...");
      const upfrontResponse = await client.license.registerCommercialUsePIL({
        currency: WIP_TOKEN,
        defaultMintingFee: params.upfrontFee.toString(),
        txOptions: { waitForTransaction: true },
      });

      console.log("Upfront license registered:", upfrontResponse);

      // Register revenue-share commercial remix license
      console.log("\nRegistering revenue-share commercial remix license...");
      const revenueShareResponse =
        await client.license.registerCommercialRemixPIL({
          currency: WIP_TOKEN,
          defaultMintingFee: params.revenueFee.toString(),
          commercialRevShare: params.revenueShare,
          txOptions: { waitForTransaction: true },
        });

      console.log("Revenue share license registered:", revenueShareResponse);

      // Attach both licenses to the IP asset
      console.log("\nAttaching licenses to IP asset...");

      if (
        !upfrontResponse.licenseTermsId ||
        !revenueShareResponse.licenseTermsId
      ) {
        throw new Error("License terms IDs not returned from registration");
      }

      const attachUpfront = await client.license.attachLicenseTerms({
        ipId: params.ipId as Address,
        licenseTermsId: upfrontResponse.licenseTermsId,
        txOptions: { waitForTransaction: true },
      });

      const attachRevShare = await client.license.attachLicenseTerms({
        ipId: params.ipId as Address,
        licenseTermsId: revenueShareResponse.licenseTermsId,
        txOptions: { waitForTransaction: true },
      });

      console.log("\nLicense terms attached successfully!");
      console.log(
        "Upfront License Terms ID:",
        upfrontResponse.licenseTermsId.toString()
      );
      console.log(
        "Revenue Share License Terms ID:",
        revenueShareResponse.licenseTermsId.toString()
      );

      return {
        upfrontTermsId: upfrontResponse.licenseTermsId,
        revenueTermsId: revenueShareResponse.licenseTermsId,
        txHashes: [
          upfrontResponse.txHash,
          revenueShareResponse.txHash,
          attachUpfront.txHash,
          attachRevShare.txHash,
        ].filter((hash): hash is string => !!hash),
      };
    } catch (error) {
      console.error("Error registering dual license terms:", error);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerDualLicenseTerms,
    isRegistering,
  };
}
