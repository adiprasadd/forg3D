"use client";

import { useState } from "react";
import { useStoryProtocol } from "@/app/hooks/useStoryProtocol";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/app/lib/s3/config";
import { useLicenseMinting } from "@/app/hooks/useLicenseMinting";
import { createAndRegisterIPAsset } from "@/scripts/registerIPAsset";
import { useWallet } from "../components/WalletProvider";

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
    licenseTokenId?: string;
    licenseTermsIds?: {
      upfront: string;
      revenue: string;
    };
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
  licenseTokenId?: string;
  spgNftContract: string;
}

interface LicenseTermsResponse {
  upfrontTermsId: bigint;
  revenueTermsId: bigint;
  txHashes: string[];
}

interface TransactionDetails {
  collectionTxHash: string;
  spgNftContract: string;
  ipAssetTxHash: string;
  ipId: string;
  tokenId?: string;
  licenseTokenId?: string;
  licenseTermsIds?: {
    upfront: string;
    revenue: string;
  };
}

export function ModelUploader() {
  const { client } = useStoryProtocol();
  const { registerDualLicenseTerms } = useLicenseMinting();
  const { isConnected, connect, address } = useWallet();

  console.log("Wallet status:", { isConnected, address });
  console.log("Story Protocol client:", { hasClient: !!client });

  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: "idle",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    modelFile: [] as File[],
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const fieldName = input.name;

    if (!input.files || input.files.length === 0) {
      console.log("No file selected");
      setFormData((prev) => ({ ...prev, [fieldName]: null }));
      return;
    }

    const files = input.files;

    try {
      console.log(`📂 File selected for ${fieldName}:`, {
        names: Array.from(files).map((f) => f.name),
        types: Array.from(files).map(
          (f) => f.type || "application/octet-stream"
        ),
        sizes: Array.from(files).map((f) => f.size),
        lastModifieds: Array.from(files).map((f) =>
          new Date(f.lastModified).toISOString()
        ),
      });

      // Only validate model files
      if (fieldName === "modelFile") {
        for (const file of files) {
          validateFile(file);
        }
      }

      // Create new File instances to ensure they're properly formed
      const newFiles = Array.from(files).map(
        (file) =>
          new File([file], file.name, {
            type: file.type || "application/octet-stream",
            lastModified: file.lastModified,
          })
      );

      // Update form data with the new files
      setFormData((prev) => ({
        ...prev,
        [fieldName]: newFiles,
      }));

      // Clear any previous errors
      setUploadState((prev) => ({
        ...prev,
        status: "idle",
        error: undefined,
      }));
    } catch (error) {
      console.error(`❌ Error handling ${fieldName}:`, error);
      setUploadState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Invalid file",
      }));

      // Clear the file input
      input.value = "";
      setFormData((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked");

    if (!formData.modelFile || formData.modelFile.length === 0) {
      console.error("No model files selected");
      setUploadState((prev) => ({
        ...prev,
        status: "error",
        error: "Please select model files",
      }));
      return;
    }

    try {
      setUploadState({ progress: 0, status: "uploading" });

      // Create a new FormData instance
      const modelFormData = new FormData();

      // Log file details before upload
      console.log("📤 Preparing to upload files:", {
        names: formData.modelFile.map((f) => f.name),
        types: formData.modelFile.map(
          (f) => f.type || "application/octet-stream"
        ),
        sizes: formData.modelFile.map((f) => f.size),
        lastModifieds: formData.modelFile.map((f) =>
          new Date(f.lastModified).toISOString()
        ),
      });

      // Append the files with the correct field names
      for (let i = 0; i < formData.modelFile.length; i++) {
        modelFormData.append(`model_${i}`, formData.modelFile[i]);
        modelFormData.append(`baseFileName_${i}`, formData.modelFile[i].name);
      }

      // If this is a GLTF file, we need to handle associated files
      if (formData.modelFile[0].name.toLowerCase().endsWith(".gltf")) {
        // Get the FileList from the input
        const input = document.querySelector(
          'input[name="modelFile"]'
        ) as HTMLInputElement;
        if (input?.files) {
          // Append all files from the input
          for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            if (!formData.modelFile.includes(file)) {
              modelFormData.append(`file_${i}`, file);
              console.log(`Adding associated file: ${file.name}`);
            }
          }
        }
      }

      modelFormData.append(
        "metadata",
        JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          royaltyPercentage: formData.royaltyPercentage,
        })
      );

      // If preview image exists, append it
      if (formData.previewImage) {
        modelFormData.append("cover", formData.previewImage);
      }

      // Log form data contents
      console.log("📦 Form data entries:");
      for (const [key, value] of modelFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type || "application/octet-stream",
            size: value.size,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Make the upload request
      const response = await fetch("/api/upload", {
        method: "POST",
        body: modelFormData,
      });

      // Log response details
      console.log("📥 Upload response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Upload failed:", errorData);
        throw new Error(errorData.error || "Failed to upload files");
      }

      const responseData = await response.json();
      console.log("✅ Upload successful:", responseData);

      // Use the fileKeys from the response
      const fileKeys = responseData.fileKeys;
      console.log("Using file keys:", fileKeys);

      // Upload preview image if exists
      let previewImageKey;
      if (formData.previewImage) {
        console.log("Uploading preview image:", formData.previewImage.name);
        const previewFormData = new FormData();
        previewFormData.append("model", formData.previewImage);
        previewFormData.append("baseFileName", formData.previewImage.name);

        const previewResponse = await fetch("/api/upload", {
          method: "POST",
          body: previewFormData,
        });

        if (!previewResponse.ok) {
          const errorData = await previewResponse.json();
          console.error("Preview upload error:", errorData);
          throw new Error(
            `Failed to upload preview: ${errorData.error || "Unknown error"}`
          );
        }

        const previewData = await previewResponse.json();
        console.log("Preview upload response:", previewData);
        previewImageKey = previewData.fileKey;
      }

      setUploadState((prev) => ({
        ...prev,
        status: "processing",
        progress: 100,
        details: {},
      }));

      // Step 1: Register IP Asset using the script
      console.log("\n🎯 Starting model upload and NFT minting process...");
      let responseIPAssets: IPAssetResponse[] = [];
      try {
        console.log("📦 Model details:", {
          names: formData.modelFile.map((f) => f.name),
          types: formData.modelFile.map(
            (f) => f.type || "application/octet-stream"
          ),
          sizes: formData.modelFile.map((f) => f.size),
          lastModifieds: formData.modelFile.map((f) =>
            new Date(f.lastModified).toISOString()
          ),
          modelUrls: fileKeys,
          previewUrls: previewImageKey ? [previewImageKey] : [],
          prices: formData.modelFile.map((f) => f.size),
          royaltyPercentages: formData.royaltyPercentage,
        });

        responseIPAssets = await Promise.all(
          formData.modelFile.map((file, index) =>
            createAndRegisterIPAsset({
              name: file.name,
              description: formData.description,
              modelUrl: fileKeys[index],
              previewUrl: previewImageKey,
              price: file.size,
              royaltyPercentage: Number(formData.royaltyPercentage),
            })
          )
        );

        if (
          responseIPAssets.length === 0 ||
          !responseIPAssets[0].txHash ||
          !responseIPAssets[0].ipId
        ) {
          console.error("Missing transaction details:", responseIPAssets);
          throw new Error(
            "Failed to register IP assets - missing transaction details"
          );
        }

        console.log("\n✅ NFT Minting successful!");
        console.log("Transaction Details:", {
          txHashes: responseIPAssets.map((asset) => asset.txHash),
          ipIds: responseIPAssets.map((asset) => asset.ipId),
          tokenIds: responseIPAssets.map((asset) => asset.tokenId?.toString()),
          spgNftContracts: responseIPAssets.map(
            (asset) => asset.spgNftContract
          ),
        });

        setUploadState((prev) => ({
          ...prev,
          details: {
            ...prev.details,
            collectionTxHash: responseIPAssets[0].txHash,
            spgNftContract: responseIPAssets[0].spgNftContract,
            ipAssetTxHashes: responseIPAssets.map((asset) => asset.txHash),
            ipIds: responseIPAssets.map((asset) => asset.ipId),
            tokenIds: responseIPAssets.map((asset) =>
              asset.tokenId?.toString()
            ),
            licenseTokenIds: responseIPAssets.map((asset) =>
              asset.licenseTokenId?.toString()
            ),
          },
        }));

        // Step 2: Register dual license terms
        console.log(
          "%c Registering dual license terms...",
          "color: yellow; font-weight: bold"
        );
        let licenseTerms: LicenseTermsResponse | undefined;
        try {
          licenseTerms = await registerDualLicenseTerms({
            ipIds: responseIPAssets.map((asset) => asset.ipId),
            upfrontFees: responseIPAssets.map(
              (asset) => BigInt(asset.size) * BigInt(1e18)
            ),
            revenueFees: responseIPAssets.map(
              (asset) => (BigInt(asset.size) * BigInt(1e18)) / BigInt(2)
            ),
            revenueShares: responseIPAssets.map((asset) =>
              Number(formData.royaltyPercentage)
            ),
          });

          if (licenseTerms?.upfrontTermsId && licenseTerms?.revenueTermsId) {
            console.log(
              "%c License terms registered successfully:",
              "color: green; font-weight: bold"
            );
            console.log({
              upfrontTermsId: licenseTerms.upfrontTermsId.toString(),
              revenueTermsId: licenseTerms.revenueTermsId.toString(),
              txHashes: licenseTerms.txHashes,
            });

            setUploadState((prev) => ({
              ...prev,
              details: {
                ...prev.details,
                licenseTermsIds: {
                  upfront: licenseTerms.upfrontTermsId.toString(),
                  revenue: licenseTerms.revenueTermsId.toString(),
                },
              },
            }));
          }
        } catch (error) {
          console.error("Error registering license terms:", error);
          throw new Error(
            "Failed to register license terms: " +
              (error instanceof Error ? error.message : "Unknown error")
          );
        }

        // Save all details to database
        console.log("\n📝 Saving model details to database...");
        console.log(
          "IP Assets IDs to be saved:",
          responseIPAssets.map((asset) => asset.ipId)
        );

        const modelData = {
          name: formData.name,
          description: formData.description,
          modelUrls: fileKeys,
          previewUrls: previewImageKey ? [previewImageKey] : [],
          prices: formData.modelFile.map((f) => f.size),
          royaltyPercentages: formData.royaltyPercentage,
          ipIds: responseIPAssets.map((asset) => asset.ipId),
          txHashes: responseIPAssets.map((asset) => asset.txHash),
          spgNftContracts: responseIPAssets.map(
            (asset) => asset.spgNftContract
          ),
          tokenIds: responseIPAssets.map((asset) => asset.tokenId?.toString()),
          licenseTokenIds: responseIPAssets.map((asset) =>
            asset.licenseTokenId?.toString()
          ),
          licenseTermsIds:
            licenseTerms?.upfrontTermsId && licenseTerms?.revenueTermsId
              ? {
                  upfront: licenseTerms.upfrontTermsId.toString(),
                  revenue: licenseTerms.revenueTermsId.toString(),
                }
              : undefined,
        };

        console.log("Full model data to be saved:", modelData);

        const modelResponse = await fetch("/api/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modelData),
        });

        if (!modelResponse.ok) {
          const errorData = await modelResponse.json();
          console.error("Failed to save model details:", errorData);
          throw new Error(
            `Failed to save model details: ${
              errorData.error || "Unknown error"
            }`
          );
        }

        const savedData = await modelResponse.json();
        console.log("\n✅ Model details saved successfully:", savedData);

        // Add console logging for license token IDs
        console.log(
          "%c License Token IDs:",
          "color: green; font-weight: bold",
          responseIPAssets.map(
            (asset) => asset.licenseTokenId?.toString() || "Not available"
          )
        );

        const transactionDetails: TransactionDetails = {
          collectionTxHash: responseIPAssets[0].txHash,
          spgNftContract: responseIPAssets[0].spgNftContract,
          ipAssetTxHashes: responseIPAssets.map((asset) => asset.txHash),
          ipIds: responseIPAssets.map((asset) => asset.ipId),
          tokenIds: responseIPAssets.map((asset) => asset.tokenId?.toString()),
          licenseTokenIds: responseIPAssets.map((asset) =>
            asset.licenseTokenId?.toString()
          ),
        };

        if (licenseTerms?.upfrontTermsId && licenseTerms?.revenueTermsId) {
          transactionDetails.licenseTermsIds = {
            upfront: licenseTerms.upfrontTermsId.toString(),
            revenue: licenseTerms.revenueTermsId.toString(),
          };
        }

        console.log(
          "%c All Transaction Details:",
          "color: blue; font-weight: bold",
          transactionDetails
        );

        setUploadState((prev) => ({
          ...prev,
          progress: 100,
          status: "success",
          details: {
            ...prev.details,
            ipIds: responseIPAssets.map((asset) => asset.ipId),
            licenseTokenIds: responseIPAssets.map((asset) =>
              asset.licenseTokenId?.toString()
            ),
          },
        }));

        // Reset form
        setFormData({
          name: "",
          description: "",
          modelFile: [],
          previewImage: null,
          price: "",
          royaltyPercentage: "10",
          licenseType: "standard",
        });
      } catch (error) {
        console.error("Error in upload process:", error);
        setUploadState((prev) => ({
          ...prev,
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        }));
      }
    } catch (error) {
      console.error("Error uploading models:", error);
      setUploadState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      }));
    }
  };

  return (
    <>
      {!isConnected ? (
        <div className="text-center p-6">
          <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-4">
            Please connect your wallet to upload models
          </p>
          <button
            onClick={connect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
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
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Model Files
            </label>
            <div className="relative">
              <input
                type="file"
                name="modelFile"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700"
                accept=".gltf,.glb,.obj"
                multiple={true}
                webkitdirectory=""
                required
              />
              {formData.modelFile && (
                <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Selected files:{" "}
                    {formData.modelFile.map((f) => f.name).join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">
                    Sizes:{" "}
                    {formData.modelFile
                      .map((f) => Math.round(f.size / 1024))
                      .join(" KB, ")}{" "}
                    KB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Preview Image
            </label>
            <input
              type="file"
              name="previewImage"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price (ETH)
            </label>
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
                Models Successfully Uploaded! 🎉
              </h3>

              <div className="space-y-2 font-mono text-sm">
                <h4 className="font-bold text-green-400">
                  NFT Collections Created:
                </h4>
                <p>
                  Transaction Hashes: {uploadState.details.txHashes.join(", ")}
                </p>
                <p>
                  Contract Addresses:{" "}
                  {uploadState.details.spgNftContracts.join(", ")}
                </p>

                <h4 className="font-bold text-green-400 mt-4">
                  IP Assets Registered:
                </h4>
                <p>
                  Transaction Hashes:{" "}
                  {uploadState.details.ipAssetTxHashes.join(", ")}
                </p>
                <p>IP Asset IDs: {uploadState.details.ipIds.join(", ")}</p>
                <p>Token IDs: {uploadState.details.tokenIds.join(", ")}</p>
                {uploadState.details.licenseTokenIds && (
                  <p>
                    License Token IDs:{" "}
                    {uploadState.details.licenseTokenIds.join(", ")}
                  </p>
                )}

                {uploadState.details.licenseTermsIds && (
                  <>
                    <h4 className="font-bold text-green-400 mt-4">
                      License Terms Registered:
                    </h4>
                    <p>
                      Upfront License Terms ID:{" "}
                      {uploadState.details.licenseTermsIds.upfront}
                    </p>
                    <p>
                      Revenue Share License Terms ID:{" "}
                      {uploadState.details.licenseTermsIds.revenue}
                    </p>
                  </>
                )}
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
                    uploadState.status === "error"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
              <p
                className={`mt-2 text-sm ${
                  uploadState.status === "error"
                    ? "text-red-500"
                    : "text-gray-400"
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
              : "Upload Models"}
          </button>
        </form>
      )}
    </>
  );
}
