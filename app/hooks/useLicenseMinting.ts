"use client";

import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";

interface MintLicenseParams {
  ipId: string;
  terms: {
    commercial: boolean;
    territory: string;
    duration: string;
  };
}

export function useLicenseMinting() {
  const { client, isInitialized } = useStoryProtocol();
  const [isMinting, setIsMinting] = useState(false);

  const mintLicense = async ({ ipId, terms }: MintLicenseParams) => {
    if (!client || !isInitialized) {
      throw new Error("Story Protocol client not initialized");
    }

    try {
      setIsMinting(true);

      const tx = await client.licensing.mintLicense({
        ipId,
        terms: {
          commercial: terms.commercial,
          territory: terms.territory,
          duration: terms.duration,
          // Add other terms as needed
        },
      });

      const receipt = await tx.wait();
      return receipt.licenseId;
    } catch (error) {
      console.error("License minting error:", error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  return { mintLicense, isMinting };
}
