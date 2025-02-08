"use client";

import { useState, useCallback } from "react";
import { StoryClient } from "@story-protocol/core-sdk";
import { storyProtocol } from "../lib/story-protocol/client";

export function useStoryProtocol() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask to continue");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts[0]) {
        // Initialize with MetaMask account instead of private key
        await storyProtocol.initializeClient();
        setIsInitialized(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    isInitialized,
    isConnecting,
    error,
    connectWallet,
    client: storyProtocol.getClient(),
  };
}
