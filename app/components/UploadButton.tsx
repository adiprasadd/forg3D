"use client";

import { useState } from "react";
import { useWallet } from "./WalletProvider";
import { useStoryProtocol } from "../hooks/useStoryProtocol";
import { useIPAssetRegistration } from "../hooks/useIPAssetRegistration";

interface UploadButtonProps {
  onUploadComplete?: (result: {
    url: string;
    fileName: string;
    ipId?: string;
  }) => void;
  className?: string;
  label?: string;
}

const ALLOWED_FILE_TYPES = [
  ".obj",
  ".mtl",
  ".gltf",
  ".usdz",
  ".glb",
  ".fbx",
  ".blend",
  ".jpg",
  ".jpeg",
  ".png",
  ".tga",
  ".exr",
  ".tif",
  ".bmp",
  ".hdr",
];

export default function UploadButton({
  onUploadComplete,
  className = "",
  label = "Upload",
}: UploadButtonProps) {
  const { isConnected, connect } = useWallet();
  const { isInitialized, error: storyError, reconnect } = useStoryProtocol();
  const { registerIPAsset, isRegistering } = useIPAssetRegistration();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setError(null);

    // Connect wallet if needed
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        setError("Failed to connect wallet. Please try again.");
        return;
      }
    }

    try {
      setIsUploading(true);

      // Upload file first
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url, fileName } = await response.json();

      // Register IP if wallet is connected
      let ipId;
      if (isInitialized) {
        console.log("Registering IP for model:", fileName);
        ipId = await registerIPAsset({
          name: fileName,
          description: `3D Model: ${fileName}`,
          mediaUrl: url,
          type: "3D_MODEL",
        });
        console.log("IP registered with ID:", ipId);
      }

      onUploadComplete?.({ url, fileName, ipId });
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsUploading(false);
    }
  };

  const isProcessing = isUploading || isRegistering;

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {storyError && (
        <p className="text-red-500 mb-4">
          Story Protocol Error: {storyError}
          <button onClick={reconnect} className="ml-2 underline">
            Try Again
          </button>
        </p>
      )}
      <label className={`inline-block ${className}`}>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          disabled={isProcessing}
          className="hidden"
          accept={ALLOWED_FILE_TYPES.join(",")}
        />
        <span
          className={`inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer
            ${
              isProcessing ? "opacity-50" : "hover:bg-blue-600"
            } transition-colors`}
        >
          {isUploading
            ? "Uploading..."
            : isRegistering
            ? "Registering IP..."
            : label}
        </span>
      </label>
    </div>
  );
}
