"use client";

// Add type declaration at the top of the file
declare global {
  interface Window {
    ethereum?: any;
  }
}

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

  const checkConnection = async () => {
    console.log("🔍 Checking wallet connection...");
    if (typeof window.ethereum !== "undefined") {
      console.log("✓ MetaMask is installed");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        console.log("Current accounts:", accounts);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          console.log("✓ Wallet connected:", accounts[0]);
        } else {
          console.log("✗ No accounts found - wallet not connected");
          setAddress(null);
          setIsConnected(false);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setAddress(null);
        setIsConnected(false);
      }
    } else {
      console.log("✗ MetaMask is not installed");
      setAddress(null);
      setIsConnected(false);
    }
  };

  const connect = async () => {
    console.log("🔌 Attempting to connect wallet...");
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          console.log("✓ Successfully connected to wallet:", accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  // Add useEffect to check connection on mount
  useEffect(() => {
    console.log("🔄 WalletProvider mounted - checking initial connection");
    checkConnection();

    // Listen for account changes
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log("🔄 Accounts changed:", accounts);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setIsConnected(false);
        }
      });
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", () => {
          console.log("🔌 Removed account change listener");
        });
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{ isConnected, address, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
