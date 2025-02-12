"use client";

import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { useWallet } from "../components/WalletProvider";

export function useLicenseManagement() {
  const { client } = useStoryProtocol();
  const { address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const verifyLicense = async (licenseTokenId: string): Promise<boolean> => {
    if (!client || !address) {
      throw new Error("Client or wallet not connected");
    }

    try {
      setIsLoading(true);

      // Get license terms from Story Protocol
      const { terms } = await client.license.getLicenseTerms(licenseTokenId);

      // Check if the license is valid (not expired)
      const isValid =
        !terms.expiration ||
        BigInt(terms.expiration) > BigInt(Math.floor(Date.now() / 1000));

      // Check if the current user has the required permissions
      const hasPermissions = terms.commercialUse && terms.derivativesAllowed;

      return isValid && hasPermissions;
    } catch (error) {
      console.error("Error verifying license:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyLicense,
    isLoading,
  };
}
