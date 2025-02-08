"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "./useMetaMask";

interface TransactionState {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  confirmations: number;
}

export function useTransactionMonitor() {
  const { provider } = useMetaMask();
  const [transactions, setTransactions] = useState<
    Record<string, TransactionState>
  >({});

  const monitorTransaction = useCallback(
    async (hash: string) => {
      if (!provider) return;

      setTransactions((prev) => ({
        ...prev,
        [hash]: { hash, status: "pending", confirmations: 0 },
      }));

      try {
        const receipt = await provider.waitForTransaction(
          hash,
          1, // Wait for 1 confirmation
          30000 // 30 second timeout
        );

        setTransactions((prev) => ({
          ...prev,
          [hash]: {
            hash,
            status: receipt.status === 1 ? "confirmed" : "failed",
            confirmations: 1,
          },
        }));

        // Continue monitoring for more confirmations
        const transaction = await provider.getTransaction(hash);
        if (transaction) {
          provider.on(hash, (tx) => {
            if (tx.confirmations > 1) {
              setTransactions((prev) => ({
                ...prev,
                [hash]: {
                  ...prev[hash],
                  confirmations: tx.confirmations,
                },
              }));
            }
          });
        }
      } catch (error) {
        console.error(`Transaction monitoring error for ${hash}:`, error);
        setTransactions((prev) => ({
          ...prev,
          [hash]: { hash, status: "failed", confirmations: 0 },
        }));
      }
    },
    [provider]
  );

  return {
    transactions,
    monitorTransaction,
  };
}
