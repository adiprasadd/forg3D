import { useState, useEffect } from "react";
import { useStoryProtocol } from "./useStoryProtocol";

interface ClaimRevenueParams {
  modelId: string;
  childIpIds?: `0x${string}`[];
  royaltyPolicies?: `0x${string}`[];
}

export function useRevenueClaims(modelId: string) {
  const { client } = useStoryProtocol();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [claimableAmount, setClaimableAmount] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClaimableRevenue();
  }, [modelId]);

  const fetchClaimableRevenue = async () => {
    if (!client) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/models/${modelId}/claim-revenue`);
      if (!response.ok) throw new Error("Failed to fetch claimable revenue");

      const data = await response.json();
      setClaimableAmount(data.claimable);
    } catch (err) {
      console.error("Error fetching claimable revenue:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch claimable revenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const claimRevenue = async (params: ClaimRevenueParams) => {
    if (!client) {
      setError("Story Protocol client not initialized");
      return;
    }

    try {
      setIsClaiming(true);
      setError(null);

      const response = await fetch(
        `/api/models/${params.modelId}/claim-revenue`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childIpIds: params.childIpIds,
            royaltyPolicies: params.royaltyPolicies,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to claim revenue");
      }

      const data = await response.json();
      await fetchClaimableRevenue(); // Refresh claimable amount
      return data;
    } catch (err) {
      console.error("Error claiming revenue:", err);
      setError(err instanceof Error ? err.message : "Failed to claim revenue");
      throw err;
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    claimRevenue,
    claimableAmount,
    isClaiming,
    isLoading,
    error,
    refresh: fetchClaimableRevenue,
  };
}
