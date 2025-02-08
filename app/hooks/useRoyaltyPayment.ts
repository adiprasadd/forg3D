import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";

interface PayRoyaltyParams {
  modelId: string;
  amount: string;
  payerIpId?: string;
}

export function useRoyaltyPayment() {
  const { client } = useStoryProtocol();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payRoyalty = async (params: PayRoyaltyParams) => {
    if (!client) {
      setError("Story Protocol client not initialized");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch(
        `/api/models/${params.modelId}/pay-royalty`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: params.amount,
            payerIpId: params.payerIpId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process royalty payment");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error processing royalty payment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process royalty payment"
      );
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    payRoyalty,
    isProcessing,
    error,
  };
}
