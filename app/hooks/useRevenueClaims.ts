"use client";

import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { useWallet } from "../components/WalletProvider";
import { Address } from "viem";

// WIP token address on Story Protocol
const WIP_TOKEN = "0x1514000000000000000000000000000000000000" as Address;

interface RevenueInfo {
  claimableAmount: bigint;
  isLoading: boolean;
  error: string | null;
}

export function useRevenueClaims() {
  const { client, isInitialized } = useStoryProtocol();
  const { address } = useWallet();
  const [isClaiming, setIsClaiming] = useState(false);

  const getClaimableRevenue = async (
    ipAssetId: string
  ): Promise<RevenueInfo> => {
    if (!client || !isInitialized || !address) {
      return {
        claimableAmount: 0n,
        isLoading: false,
        error: "Client not initialized or wallet not connected",
      };
    }

    try {
      console.log(`Checking claimable amount for IP Asset ${ipAssetId}...`);

      const claimableAmount = await client.royalty.claimableRevenue({
        royaltyVaultIpId: ipAssetId as Address,
        claimer: address as Address,
        token: WIP_TOKEN,
      });

      console.log(`Claimable amount: ${claimableAmount.toString()} WIP tokens`);

      return {
        claimableAmount,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      console.error("Error checking claimable revenue:", error);
      return {
        claimableAmount: 0n,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to check revenue",
      };
    }
  };

  const claimRevenue = async (ipAssetId: string) => {
    if (!client || !isInitialized || !address) {
      throw new Error("Client not initialized or wallet not connected");
    }

    try {
      setIsClaiming(true);
      console.log(`Claiming revenue for IP Asset ${ipAssetId}...`);

      const response = await client.royalty.claimAllRevenue({
        ancestorIpId: ipAssetId as Address,
        claimer: address as Address,
        childIpIds: [], // No child IPs in this case
        royaltyPolicies: [], // No specific policies
        currencyTokens: [WIP_TOKEN],
      });

      console.log("\nRevenue claimed successfully!");
      console.log("Transaction Hashes:", response.txHashes);

      return response;
    } catch (error) {
      console.error("Error claiming revenue:", error);
      throw error;
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    getClaimableRevenue,
    claimRevenue,
    isClaiming,
  };
}
