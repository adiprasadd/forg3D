"use client";

import { useEffect } from "react";
import { useWallet } from "./WalletProvider";
import { useStoryProtocol } from "@/app/hooks/useStoryProtocol";

export function WalletDebug() {
  const { isConnected, address } = useWallet();
  const { client, isInitialized, error } = useStoryProtocol();

  useEffect(() => {
    console.log("🔍 WalletDebug mounted");
    console.log("Initial state:", {
      wallet: { isConnected, address },
      storyProtocol: { isInitialized, hasClient: !!client, error },
    });
  }, []);

  useEffect(() => {
    console.log("State changed:", {
      wallet: { isConnected, address },
      storyProtocol: { isInitialized, hasClient: !!client, error },
    });
  }, [isConnected, address, isInitialized, client, error]);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 rounded-lg shadow-lg text-sm font-mono max-w-md">
      <h3 className="font-bold mb-2">Debug Panel</h3>
      <div className="space-y-2">
        <div>
          <h4 className="text-blue-400">Wallet Status</h4>
          <p>Connected: {isConnected ? "✅" : "❌"}</p>
          <p className="break-all">Address: {address || "Not connected"}</p>
        </div>
        <div>
          <h4 className="text-blue-400">Story Protocol Status</h4>
          <p>Initialized: {isInitialized ? "✅" : "❌"}</p>
          <p>Client Ready: {client ? "✅" : "❌"}</p>
          {error && <p className="text-red-400 break-all">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
}
