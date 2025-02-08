"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Check initial connection
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts[0]) {
            setIsConnected(true);
            setAddress(accounts[0].address);
          }
        } catch (e) {
          console.error("Failed to check wallet connection:", e);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        } else {
          setIsConnected(false);
          setAddress(null);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Please install MetaMask!");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts[0]) {
        setIsConnected(true);
        setAddress(accounts[0]);
      }
    } catch (e) {
      console.error("Failed to connect wallet:", e);
      throw e;
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{ isConnected, address, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
