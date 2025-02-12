"use client";

import { useState } from "react";
import { LicenseTier } from "../hooks/useLicenseManagement";
import { useLicenseManagement } from "../hooks/useLicenseManagement";
import LicenseTierSelector from "./LicenseTierSelector";

interface LicenseMintingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
  modelName: string;
}

export default function LicenseMintingDialog({
  isOpen,
  onClose,
  modelId,
  modelName,
}: LicenseMintingDialogProps) {
  const { mintLicense, isProcessing, error } = useLicenseManagement();
  const [selectedTier, setSelectedTier] = useState<LicenseTier | null>(null);
  const [mintingResult, setMintingResult] = useState<{
    licenseTermsId?: string;
    licenseTokenIds?: string[];
    txHash?: string;
  } | null>(null);

  const handleMint = async () => {
    if (!selectedTier) return;

    try {
      const result = await mintLicense(modelId, selectedTier);
      setMintingResult(result);
    } catch (err) {
      console.error("Error minting license:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Purchase License</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-gray-600">
            Select a license tier for {modelName}
          </p>
        </div>

        <div className="p-6">
          <LicenseTierSelector
            onSelect={(tier) => setSelectedTier(tier)}
            selectedTier={selectedTier || undefined}
            disabled={isProcessing}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {mintingResult && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                License Minted Successfully!
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="font-medium text-green-700">
                  License Terms ID:
                </dt>
                <dd className="text-green-800">
                  {mintingResult.licenseTermsId}
                </dd>
                <dt className="font-medium text-green-700">
                  License Token IDs:
                </dt>
                <dd className="text-green-800">
                  {mintingResult.licenseTokenIds?.join(", ")}
                </dd>
                <dt className="font-medium text-green-700">
                  Transaction Hash:
                </dt>
                <dd className="text-green-800 break-all">
                  {mintingResult.txHash}
                </dd>
              </dl>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleMint}
              disabled={!selectedTier || isProcessing}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                (!selectedTier || isProcessing) &&
                "opacity-50 cursor-not-allowed"
              }`}
            >
              {isProcessing ? "Minting..." : "Mint License"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
