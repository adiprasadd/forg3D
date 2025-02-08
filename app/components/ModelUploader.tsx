"use client";

import { useState } from "react";
import { useStoryProtocol } from "@/app/hooks/useStoryProtocol";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/app/lib/s3/config";

// Helper function to create SHA-256 hash
async function createSHA256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface UploadState {
  progress: number;
  status: "idle" | "uploading" | "processing" | "success" | "error";
  error?: string;
  details?: {
    collectionTxHash?: string;
    spgNftContract?: string;
    ipAssetTxHash?: string;
    ipId?: string;
    tokenId?: string;
  };
}

interface NFTCollectionResponse {
  txHash: string;
  spgNftContract: string;
}

interface IPAssetResponse {
  txHash: string;
  ipId: string;
  tokenId?: bigint;
}

export function ModelUploader() {
  const { client } = useStoryProtocol();
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: "idle",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    modelFile: null as File | null,
    previewImage: null as File | null,
    price: "",
    royaltyPercentage: "10",
    licenseType: "standard",
  });

  const validateFile = (file: File) => {
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      throw new Error(`File type ${ext} not supported`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      );
    }
  };

  const uploadToS3 = async (file: File, presignedUrl: string) => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadState((prev) => ({ ...prev, progress }));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        validateFile(file);
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: file,
        }));
        setUploadState((prev) => ({ ...prev, error: undefined }));
      } catch (error) {
        setUploadState((prev) => ({
          ...prev,
          status: "error",
          error: error instanceof Error ? error.message : "Invalid file",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !formData.modelFile) return;

    try {
      setUploadState({ progress: 0, status: "uploading" });

      // Get presigned URL for model file
      const modelFormData = new FormData();
      modelFormData.append("file", formData.modelFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: modelFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, fileKey } = await uploadResponse.json();

      // Upload to S3
      await uploadToS3(formData.modelFile, uploadUrl);

      // Upload preview image if exists
      let previewImageKey;
      if (formData.previewImage) {
        const previewFormData = new FormData();
        previewFormData.append("file", formData.previewImage);

        const previewResponse = await fetch("/api/upload", {
          method: "POST",
          body: previewFormData,
        });

        if (previewResponse.ok) {
          const { uploadUrl: previewUploadUrl, fileKey: previewKey } =
            await previewResponse.json();
          await uploadToS3(formData.previewImage, previewUploadUrl);
          previewImageKey = previewKey;
        }
      }

      setUploadState((prev) => ({
        ...prev,
        status: "processing",
        details: {},
      }));

      // Step 1: Create NFT Collection
      console.log(
        "%c Creating new NFT collection...",
        "color: yellow; font-weight: bold"
      );
      let newCollection: NFTCollectionResponse;
      try {
        newCollection = (await client.nftClient.createNFTCollection({
          name: `${formData.name} Collection`,
          symbol: "3DMDL",
          isPublicMinting: true,
          mintOpen: true,
          mintFeeRecipient:
            "0x0000000000000000000000000000000000000000" as `0x${string}`,
          contractURI: "",
          txOptions: { waitForTransaction: true },
        })) as NFTCollectionResponse;

        if (!newCollection.txHash || !newCollection.spgNftContract) {
          throw new Error(
            "Failed to create NFT collection - missing transaction details"
          );
        }

        console.log(
          "%c NFT Collection created successfully:",
          "color: green; font-weight: bold"
        );
        console.log({
          txHash: newCollection.txHash,
          spgNftContract: newCollection.spgNftContract,
        });

        setUploadState((prev) => ({
          ...prev,
          details: {
            ...prev.details,
            collectionTxHash: newCollection.txHash,
            spgNftContract: newCollection.spgNftContract,
          },
        }));
      } catch (error) {
        console.error("Error creating NFT collection:", error);
        throw new Error(
          "Failed to create NFT collection: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }

      // Create metadata for IP asset registration
      const ipMetadata = {
        title: formData.name,
        description: formData.description,
        modelUrl: fileKey,
        previewUrl: previewImageKey,
        attributes: [
          { key: "Category", value: "3D Model" },
          {
            key: "Format",
            value: formData.modelFile.name.split(".").pop()?.toUpperCase(),
          },
          { key: "Price", value: formData.price },
          { key: "RoyaltyPercentage", value: formData.royaltyPercentage },
        ],
      };

      const nftMetadata = {
        name: formData.name,
        description: formData.description,
        image: previewImageKey,
        attributes: {
          category: "3D Model",
          format: formData.modelFile.name.split(".").pop()?.toUpperCase(),
          price: formData.price,
          royaltyPercentage: formData.royaltyPercentage,
        },
      };

      // Create metadata hashes
      const ipHash = await createSHA256Hash(JSON.stringify(ipMetadata));
      const nftHash = await createSHA256Hash(JSON.stringify(nftMetadata));

      // Step 2: Register IP Asset
      console.log(
        "%c Minting and registering IP asset...",
        "color: yellow; font-weight: bold"
      );
      let response: IPAssetResponse;
      try {
        response = (await client.ipAsset.mintAndRegisterIp({
          spgNftContract: newCollection.spgNftContract as `0x${string}`,
          allowDuplicates: true,
          ipMetadata: {
            ipMetadataURI: `https://example.com/ip-metadata/${fileKey}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://example.com/nft-metadata/${fileKey}`,
            nftMetadataHash: `0x${nftHash}`,
          },
          txOptions: { waitForTransaction: true },
        })) as IPAssetResponse;

        if (!response.txHash || !response.ipId) {
          throw new Error(
            "Failed to register IP asset - missing transaction details"
          );
        }

        console.log(
          "%c IP Asset registered successfully:",
          "color: green; font-weight: bold"
        );
        console.log({
          txHash: response.txHash,
          ipId: response.ipId,
          tokenId: response.tokenId?.toString(),
        });

        setUploadState((prev) => ({
          ...prev,
          details: {
            ...prev.details,
            ipAssetTxHash: response.txHash,
            ipId: response.ipId,
            tokenId: response.tokenId?.toString(),
          },
        }));
      } catch (error) {
        console.error("Error registering IP asset:", error);
        throw new Error(
          "Failed to register IP asset: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }

      // Register model in database
      const modelResponse = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          modelUrl: fileKey,
          previewUrl: previewImageKey,
          price: formData.price,
          royaltyPercentage: formData.royaltyPercentage,
          ipId: response.ipId,
          txHash: response.txHash,
          spgNftContract: newCollection.spgNftContract,
          tokenId: response.tokenId,
        }),
      });

      if (!modelResponse.ok) throw new Error("Failed to create model");

      setUploadState((prev) => ({
        ...prev,
        progress: 100,
        status: "success",
      }));

      // Reset form
      setFormData({
        name: "",
        description: "",
        modelFile: null,
        previewImage: null,
        price: "",
        royaltyPercentage: "10",
        licenseType: "standard",
      });
    } catch (error) {
      console.error("Error uploading model:", error);
      setUploadState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Model Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Model File</label>
        <input
          type="file"
          name="modelFile"
          onChange={handleFileChange}
          className="w-full"
          accept={ALLOWED_FILE_TYPES.join(",")}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Preview Image</label>
        <input
          type="file"
          name="previewImage"
          onChange={handleFileChange}
          className="w-full"
          accept=".jpg,.jpeg,.png"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price (ETH)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, price: e.target.value }))
          }
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          step="0.001"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Royalty Percentage
        </label>
        <input
          type="number"
          value={formData.royaltyPercentage}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              royaltyPercentage: e.target.value,
            }))
          }
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          min="0"
          max="100"
          required
        />
      </div>

      {uploadState.status === "success" && uploadState.details && (
        <div className="mt-4 p-6 bg-green-500/20 rounded-lg border border-green-500 text-white">
          <h3 className="text-xl font-bold mb-4">
            Model Successfully Uploaded! 🎉
          </h3>

          <div className="space-y-2 font-mono text-sm">
            <h4 className="font-bold text-green-400">
              NFT Collection Created:
            </h4>
            <p>Transaction Hash: {uploadState.details.collectionTxHash}</p>
            <p>Contract Address: {uploadState.details.spgNftContract}</p>

            <h4 className="font-bold text-green-400 mt-4">
              IP Asset Registered:
            </h4>
            <p>Transaction Hash: {uploadState.details.ipAssetTxHash}</p>
            <p>IP Asset ID: {uploadState.details.ipId}</p>
            <p>Token ID: {uploadState.details.tokenId}</p>
          </div>

          <p className="mt-4 text-sm text-green-400">
            You can view your transactions on the Story Protocol Explorer
          </p>
        </div>
      )}

      {uploadState.status !== "idle" && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                uploadState.status === "error" ? "bg-red-600" : "bg-blue-600"
              }`}
              style={{ width: `${uploadState.progress}%` }}
            ></div>
          </div>
          <p
            className={`mt-2 text-sm ${
              uploadState.status === "error" ? "text-red-500" : "text-gray-400"
            }`}
          >
            {uploadState.status === "error"
              ? uploadState.error
              : `${uploadState.progress}% uploaded`}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          uploadState.status === "uploading" ||
          uploadState.status === "processing"
        }
        className={`w-full px-4 py-2 rounded-lg ${
          uploadState.status === "uploading" ||
          uploadState.status === "processing"
            ? "bg-gray-600"
            : "bg-blue-600 hover:bg-blue-700"
        } transition`}
      >
        {uploadState.status === "uploading"
          ? "Uploading..."
          : uploadState.status === "processing"
          ? "Processing..."
          : "Upload Model"}
      </button>
    </form>
  );
}
