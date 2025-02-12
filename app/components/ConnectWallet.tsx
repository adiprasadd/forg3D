"use client";

import { useWallet } from "./WalletProvider";
import { useState } from "react";

export default function ConnectWallet() {
  const { isConnected, address, connect, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      {isConnected && address ? (
        <div className="flex items-center space-x-4">
          <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-mono">
            {formatAddress(address)}
          </span>
          <button
            onClick={disconnect}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
            ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      {error && (
        <div className="absolute top-full mt-2 w-full p-2 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {!window.ethereum && (
        <div className="absolute top-full mt-2 w-full p-2 bg-yellow-50 text-yellow-600 text-sm rounded-lg">
          Please install MetaMask to connect your wallet
        </div>
      )}
    </div>
  );
}
