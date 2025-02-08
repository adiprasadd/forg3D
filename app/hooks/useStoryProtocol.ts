"use client";

import { useState, useEffect } from "react";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { ethers } from "ethers";
import { http } from "viem";
import { useWallet } from "../components/WalletProvider";

// Story Protocol Configuration
const STORY_RPC_URL = "https://aeneid.storyrpc.io";
const STORY_CHAIN_ID = "aeneid";
const WIP_TOKEN_ADDRESS = "0x1514000000000000000000000000000000000000"; // Story Protocol WIP token

export function useStoryProtocol() {
  const { isConnected, address } = useWallet();
  const [client, setClient] = useState<StoryClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = async () => {
    try {
      // Check if MetaMask is available and connected
      if (!window.ethereum || !isConnected) {
        throw new Error("Please connect your wallet first");
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create transport
      const transport = http(STORY_RPC_URL);

      // Initialize Story Protocol client
      const config: StoryConfig = {
        transport,
        chainId: STORY_CHAIN_ID,
        account: {
          address: address as `0x${string}`,
          signMessage: async (message: string) => {
            return signer.signMessage(message);
          },
          signTransaction: async (transaction: any) => {
            return signer.signTransaction(transaction);
          },
        },
      };

      console.log("Initializing Story Protocol with config:", {
        transport: STORY_RPC_URL,
        chainId: STORY_CHAIN_ID,
        address,
      });

      const storyClient = await StoryClient.newClient(config);
      setClient(storyClient);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error("Story Protocol initialization error:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize");
    }
  };

  // Initialize when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      initializeClient();
    } else {
      setClient(null);
      setIsInitialized(false);
    }
  }, [isConnected, address]);

  return {
    client,
    isInitialized,
    error,
    reconnect: initializeClient,
  };
}
