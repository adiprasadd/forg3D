import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";

export function useLicenseMinting() {
  const { client } = useStoryProtocol();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintLicense = async (params: {
    modelId: string;
    licenseTermsId: string;
    receiver: string;
  }) => {
    if (!client) {
      setError("Story Protocol client not initialized");
      return;
    }

    try {
      setIsMinting(true);
      setError(null);

      const response = await fetch(
        `/api/models/${params.modelId}/mint-license`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            licenseTermsId: params.licenseTermsId,
            receiver: params.receiver,
            amount: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mint license");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error minting license:", err);
      setError(err instanceof Error ? err.message : "Failed to mint license");
      throw err;
    } finally {
      setIsMinting(false);
    }
  };

  return {
    mintLicense,
    isMinting,
    error,
  };
}
