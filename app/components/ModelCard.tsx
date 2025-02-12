"use client";

import { useState } from "react";
import { useWallet } from "./WalletProvider";
import LicenseMintingDialog from "./LicenseMintingDialog";
import { useLicenseManagement } from "../hooks/useLicenseManagement";

interface ModelCardProps {
  model: {
    url: string;
    fileName: string;
    ipId: string;
    price?: string;
    description?: string;
    creator?: string;
  };
}

export default function ModelCard({ model }: ModelCardProps) {
  const { isConnected, connect } = useWallet();
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const { verifyLicense } = useLicenseManagement();
  const [isVerifying, setIsVerifying] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<{
    isValid?: boolean;
    message?: string;
  } | null>(null);

  const handlePurchaseClick = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        console.error("Connection failed:", error);
        return;
      }
    }
    setShowLicenseDialog(true);
  };

  const handleVerifyLicense = async (licenseTokenId: string) => {
    try {
      setIsVerifying(true);
      const isValid = await verifyLicense(licenseTokenId);
      setLicenseStatus({
        isValid,
        message: isValid
          ? "License is valid and active"
          : "License is invalid or expired",
      });
    } catch (error) {
      console.error("Error verifying license:", error);
      setLicenseStatus({
        isValid: false,
        message: "Failed to verify license",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={model.url}
            alt={model.fileName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{model.fileName}</h3>

          {model.description && (
            <p className="text-gray-400 text-sm mb-3">{model.description}</p>
          )}

          <div className="flex flex-col space-y-2">
            {model.ipId && (
              <p className="text-sm">
                <span className="text-gray-500">IP ID:</span>{" "}
                <span className="font-mono">{model.ipId.slice(0, 10)}...</span>
              </p>
            )}

            {model.creator && (
              <p className="text-sm">
                <span className="text-gray-500">Creator:</span>{" "}
                <span className="font-mono">
                  {model.creator.slice(0, 10)}...
                </span>
              </p>
            )}

            {model.price && (
              <p className="text-lg font-bold text-blue-500">
                From {model.price} WIP
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={handlePurchaseClick}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {!isConnected ? "Connect Wallet" : "Purchase License"}
            </button>

            {licenseStatus && (
              <div
                className={`text-sm p-2 rounded ${
                  licenseStatus.isValid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {licenseStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <LicenseMintingDialog
        isOpen={showLicenseDialog}
        onClose={() => setShowLicenseDialog(false)}
        modelId={model.ipId}
        modelName={model.fileName}
      />
    </>
  );
}
