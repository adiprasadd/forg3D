"use client";

import { useState } from "react";
import { useStoryProtocol } from "../hooks/useStoryProtocol";
import { useWallet } from "./WalletProvider";
import TransactionNotification from "./TransactionNotification";

enum LicenseType {
  UPFRONT_ONLY = "upfront",
  REVENUE_SHARE = "revenue",
}

interface ProductDetailsProps {
  name: string;
  description: string;
  ipId: string;
  upfrontPrice: number;
  revenueSharePrice: number;
  revenueSharePercentage: number;
}

export default function ProductDetails({
  name,
  description,
  ipId,
  upfrontPrice,
  revenueSharePrice,
  revenueSharePercentage,
}: ProductDetailsProps) {
  const { address } = useWallet();
  const { client } = useStoryProtocol();
  const { isConnected, connect } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType | null>(
    null
  );
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (licenseType: LicenseType) => {
    if (!client || !ipId || !address) return;

    try {
      if (!isConnected) {
        await connect();
        return;
      }

      setIsProcessing(true);
      setError(null);
      setSelectedLicense(licenseType);

      console.log("Minting license for IP Asset:", ipId);
      console.log("License Type:", licenseType);

      // Get the appropriate license terms ID based on the type
      const licenseTermsId =
        licenseType === LicenseType.REVENUE_SHARE ? 114n : 113n;
      console.log("\nMinting license with term ID:", licenseTermsId.toString());

      // Mint the license token
      const response = await client.license.mintLicenseTokens({
        licenseTermsId: licenseTermsId.toString(),
        licensorIpId: ipId as `0x${string}`,
        receiver: address as `0x${string}`,
        amount: 1,
        maxMintingFee: BigInt(
          licenseType === LicenseType.UPFRONT_ONLY
            ? upfrontPrice
            : revenueSharePrice
        ),
        maxRevenueShare:
          licenseType === LicenseType.REVENUE_SHARE
            ? revenueSharePercentage
            : 0,
        txOptions: { waitForTransaction: true },
      });

      console.log("\nLicense minted successfully!");
      if (response.licenseTokenIds) {
        console.log("License Token IDs:", response.licenseTokenIds);
        console.log(
          "Explorer URL:",
          `https://explorer.story.foundation/license/${response.licenseTokenIds[0]}`
        );
      }
      console.log("Transaction Hash:", response.txHash);

      if (response.txHash) {
        setTransactionHash(response.txHash);
      }
    } catch (error) {
      console.error("Error minting license:", error);
      setError(
        error instanceof Error ? error.message : "Failed to mint license"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="text-gray-400">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Upfront License Option */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Full Purchase License</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              One-time payment
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Full commercial rights
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              No revenue sharing
            </li>
          </ul>
          <div className="text-2xl font-bold text-green-400 mb-6">
            {upfrontPrice} ETH
          </div>
          <button
            onClick={() => handlePurchase(LicenseType.UPFRONT_ONLY)}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isProcessing && selectedLicense === LicenseType.UPFRONT_ONLY
              ? "Processing..."
              : "Buy Full License"}
          </button>
        </div>

        {/* Revenue Share License Option */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Revenue Share License</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Lower upfront cost
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Commercial rights
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              {revenueSharePercentage}% revenue share
            </li>
          </ul>
          <div className="text-2xl font-bold text-green-400 mb-6">
            {revenueSharePrice} ETH + {revenueSharePercentage}% Revenue
          </div>
          <button
            onClick={() => handlePurchase(LicenseType.REVENUE_SHARE)}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isProcessing && selectedLicense === LicenseType.REVENUE_SHARE
              ? "Processing..."
              : "Get Revenue Share License"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {transactionHash && (
        <TransactionNotification
          hash={transactionHash}
          onConfirmed={() => {
            alert("License purchased successfully!");
            setTransactionHash(null);
          }}
          onFailed={() => {
            setError("Transaction failed. Please try again.");
            setTransactionHash(null);
          }}
        />
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>High-quality 3D model</li>
          <li>Instant download after purchase</li>
          <li>Format: GLTF</li>
          <li>
            IP Asset ID:{" "}
            <code className="font-mono text-green-400 bg-gray-800 px-2 py-1 rounded">
              {ipId || "Not available"}
            </code>
          </li>
          <li>
            View on{" "}
            <a
              href={`https://explorer.story.foundation/ip-asset/${ipId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Story Protocol Explorer
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
