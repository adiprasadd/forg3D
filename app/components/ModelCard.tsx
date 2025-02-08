"use client";

import { useState } from "react";
import { useLicenseMinting } from "../hooks/useLicenseMinting";
import { useRoyaltyPayment } from "../hooks/useRoyaltyPayment";
import { useMetaMask } from "../hooks/useMetaMask";
import TransactionNotification from "./TransactionNotification";

interface ModelCardProps {
  model: {
    url: string;
    fileName: string;
    ipId: string;
    price?: string;
  };
}

export default function ModelCard({ model }: ModelCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { mintLicense } = useLicenseMinting();
  const { payRoyalty } = useRoyaltyPayment();
  const { isConnected, connect } = useMetaMask();

  const handlePurchase = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        console.error("Connection failed:", error);
        return;
      }
    }

    try {
      setIsProcessing(true);

      // Mint license
      const licenseId = await mintLicense({
        ipId: model.ipId,
        terms: {
          commercial: true,
          territory: "WORLDWIDE",
          duration: "PERPETUAL",
        },
      });

      // Pay royalty
      const hash = await payRoyalty({
        ipId: model.ipId,
        amount: model.price || "0.1",
      });

      setTransactionHash(hash);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="border border-gray-700 rounded-lg p-4">
        <img
          src={model.url}
          alt={model.fileName}
          className="w-full h-48 object-cover rounded-lg"
        />
        <h3 className="mt-2 text-lg font-semibold">{model.fileName}</h3>
        {model.ipId && (
          <p className="text-sm text-gray-400">IP ID: {model.ipId}</p>
        )}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className={`mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg
            ${
              isProcessing ? "opacity-50" : "hover:bg-blue-600"
            } transition-colors`}
        >
          {!isConnected
            ? "Connect Wallet"
            : isProcessing
            ? "Processing..."
            : "Purchase License"}
        </button>
      </div>
      {transactionHash && (
        <TransactionNotification
          hash={transactionHash}
          onConfirmed={() => alert("Purchase successful!")}
          onFailed={() => alert("Transaction failed. Please try again.")}
        />
      )}
    </>
  );
}
