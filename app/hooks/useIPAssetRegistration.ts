import { useState, useCallback } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { isAddress } from "viem";

interface RegisterParams {
  nftContract: `0x${string}`;
  tokenId: string;
  metadata: {
    uri: string;
    hash: string;
  };
}

interface CreateParams {
  name: string;
  symbol: string;
  metadata: {
    uri: string;
    hash: string;
  };
}

interface RegistrationResponse {
  success: boolean;
  txHash: string;
  ipId: string;
  tokenId?: string;
  licenseTermsId?: string;
  collectionAddress?: string;
}

export function useIPAssetRegistration() {
  const { client } = useStoryProtocol();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateParams = useCallback(
    (params: RegisterParams | CreateParams) => {
      if ("nftContract" in params) {
        if (!isAddress(params.nftContract)) {
          throw new Error("Invalid NFT contract address");
        }
        if (!params.tokenId) {
          throw new Error("Token ID is required");
        }
      } else {
        if (!params.name || !params.symbol) {
          throw new Error("Name and symbol are required");
        }
      }

      if (!params.metadata?.uri || !params.metadata?.hash) {
        throw new Error("Invalid metadata: URI and hash are required");
      }
    },
    []
  );

  const registerExistingNFT = async (
    params: RegisterParams
  ): Promise<RegistrationResponse> => {
    if (!client) {
      throw new Error("Story Protocol client not initialized");
    }

    try {
      validateParams(params);
      setIsRegistering(true);
      setError(null);

      const response = await fetch("/api/models/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "register",
          ...params,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register IP asset");
      }

      return await response.json();
    } catch (err) {
      console.error("Error registering IP asset:", err);
      const message =
        err instanceof Error ? err.message : "Failed to register IP asset";
      setError(message);
      throw new Error(message);
    } finally {
      setIsRegistering(false);
    }
  };

  const createAndRegisterNFT = async (params: CreateParams) => {
    if (!client) {
      setError("Story Protocol client not initialized");
      return;
    }

    try {
      setIsRegistering(true);
      setError(null);

      const response = await fetch("/api/models/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "create",
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create and register IP asset");
      }

      return await response.json();
    } catch (err) {
      console.error("Error creating and registering IP asset:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create and register IP asset"
      );
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerExistingNFT,
    createAndRegisterNFT,
    isRegistering,
    error,
    clearError: () => setError(null),
  };
}
