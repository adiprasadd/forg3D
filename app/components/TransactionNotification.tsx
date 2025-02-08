"use client";

import { useEffect } from "react";
import { useTransactionMonitor } from "../hooks/useTransactionMonitor";

interface TransactionNotificationProps {
  hash: string;
  onConfirmed?: () => void;
  onFailed?: () => void;
}

export default function TransactionNotification({
  hash,
  onConfirmed,
  onFailed,
}: TransactionNotificationProps) {
  const { transactions, monitorTransaction } = useTransactionMonitor();
  const transaction = transactions[hash];

  useEffect(() => {
    if (hash) {
      monitorTransaction(hash);
    }
  }, [hash, monitorTransaction]);

  useEffect(() => {
    if (transaction?.status === "confirmed" && onConfirmed) {
      onConfirmed();
    } else if (transaction?.status === "failed" && onFailed) {
      onFailed();
    }
  }, [transaction?.status, onConfirmed, onFailed]);

  if (!transaction) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-gray-800 text-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-3">
        {transaction.status === "pending" && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
        )}
        {transaction.status === "confirmed" && (
          <div className="text-green-500">✓</div>
        )}
        {transaction.status === "failed" && (
          <div className="text-red-500">✗</div>
        )}
        <div>
          <p className="font-medium">
            {transaction.status === "pending" && "Transaction Pending"}
            {transaction.status === "confirmed" && "Transaction Confirmed"}
            {transaction.status === "failed" && "Transaction Failed"}
          </p>
          <p className="text-sm text-gray-400">
            {transaction.confirmations} confirmation
            {transaction.confirmations !== 1 && "s"}
          </p>
        </div>
      </div>
    </div>
  );
}
