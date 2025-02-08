import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";

interface RegisterDerivativeParams {
  parentId: string;
  childId: `0x${string}`;
  licenseTermsIds: string[];
}

interface RegisterNFTDerivativeParams {
  parentId: string;
  nftContract: `0x${string}`;
  tokenId: string;
  metadata: {
    uri: string;
    hash: string;
  };
}

export function useDerivatives() {
  const { client } = useStoryProtocol();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerDerivative = async (params: RegisterDerivativeParams) => {
    if (!client) {
      setError("Story Protocol client not initialized");
      return;
    }

    try {
      setIsRegistering(true);
      setError(null);

      const response = await fetch(
        `/api/models/${params.parentId}/derivatives`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "direct",
            childIpId: params.childId,
            licenseTermsIds: params.licenseTermsIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register derivative");
      }

      return await response.json();
    } catch (err) {
      console.error("Error registering derivative:", err);
      setError(
        err instanceof Error ? err.message : "Failed to register derivative"
      );
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  const registerNFTAsDerivative = async (
    params: RegisterNFTDerivativeParams
  ) => {
    if (!client) {
      setError("Story Protocol client not initialized");
      return;
    }

    try {
      setIsRegistering(true);
      setError(null);

      const response = await fetch(
        `/api/models/${params.parentId}/derivatives`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "nft",
            nftContract: params.nftContract,
            tokenId: params.tokenId,
            metadata: params.metadata,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register NFT derivative");
      }

      return await response.json();
    } catch (err) {
      console.error("Error registering NFT derivative:", err);
      setError(
        err instanceof Error ? err.message : "Failed to register NFT derivative"
      );
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerDerivative,
    registerNFTAsDerivative,
    isRegistering,
    error,
  };
}
