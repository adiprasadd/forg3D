"use client";

import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { ethers } from "ethers";

interface PayRoyaltyParams {
  ipId: string;
  amount: string;
}

export function useRoyaltyPayment() {
  const { client, isInitialized } = useStoryProtocol();
  const [isPaying, setIsPaying] = useState(false);

  const payRoyalty = async ({ ipId, amount }: PayRoyaltyParams) => {
    if (!client || !isInitialized) {
      throw new Error("Story Protocol client not initialized");
    }

    try {
      setIsPaying(true);

      const tx = await client.payments.payRoyalty({
        ipId,
        amount: ethers.parseEther(amount),
      });

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Royalty payment error:", error);
      throw error;
    } finally {
      setIsPaying(false);
    }
  };

  return { payRoyalty, isPaying };
}
