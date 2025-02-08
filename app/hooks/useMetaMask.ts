"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    isInstalled: false,
    isConnected: false,
    account: null,
    chainId: null,
    provider: null,
    signer: null,
  });

  useEffect(() => {
    const checkMetaMask = async () => {
      // Check if MetaMask is installed
      const isInstalled = typeof window !== "undefined" && !!window.ethereum;

      if (!isInstalled) {
        setState((prev) => ({ ...prev, isInstalled }));
        return;
      }

      try {
        // Initialize provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Get current account and chain
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Get signer if account is connected
        const signer = accounts[0] ? await provider.getSigner() : null;

        setState({
          isInstalled,
          isConnected: !!accounts[0],
          account: accounts[0] || null,
          chainId,
          provider,
          signer,
        });

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          setState((prev) => ({
            ...prev,
            isConnected: !!accounts[0],
            account: accounts[0] || null,
          }));
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", (chainId: string) => {
          setState((prev) => ({ ...prev, chainId }));
        });
      } catch (error) {
        console.error("MetaMask initialization error:", error);
      }
    };

    checkMetaMask();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setState((prev) => ({
        ...prev,
        isConnected: true,
        account: accounts[0],
        provider,
        signer,
      }));
    } catch (error) {
      console.error("MetaMask connection error:", error);
      throw error;
    }
  };

  return { ...state, connect };
}
