"use client";

import { useState } from "react";
import { useStoryMint } from "../hooks/useStoryMint";
import { useWallet } from "./WalletProvider";

export default function ModelRegistrationForm() {
  const { mintModelToken, isMinting, error: mintError } = useStoryMint();
  const { isConnected } = useWallet();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mediaUrl: "",
    thumbnailUrl: "",
    price: "0",
    royaltyPercentage: 10,
  });

  const [registrationResult, setRegistrationResult] = useState<{
    ipId?: string;
    tokenId?: bigint;
    txHash?: string;
    spgNftContract?: string;
  } | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setRegistrationResult(null);

    try {
      const result = await mintModelToken(formData);
      setRegistrationResult(result);
      // Reset form on success
      setFormData({
        name: "",
        description: "",
        mediaUrl: "",
        thumbnailUrl: "",
        price: "0",
        royaltyPercentage: 10,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Registration failed"
      );
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Register 3D Model</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Model Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Model URL (GLB/GLTF)
          </label>
          <input
            type="url"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail URL
          </label>
          <input
            type="url"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (in ETH)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.001"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Royalty Percentage
          </label>
          <input
            type="number"
            name="royaltyPercentage"
            value={formData.royaltyPercentage}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isMinting}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isMinting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isMinting ? "Minting..." : "Register & Mint"}
        </button>
      </form>

      {submitError && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-600">{submitError}</p>
        </div>
      )}

      {mintError && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-600">{mintError}</p>
        </div>
      )}

      {registrationResult && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Model Registration Successful!
          </h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="font-medium text-green-700">IP ID:</dt>
            <dd className="text-green-800">{registrationResult.ipId}</dd>
            <dt className="font-medium text-green-700">Token ID:</dt>
            <dd className="text-green-800">
              {registrationResult.tokenId?.toString()}
            </dd>
            <dt className="font-medium text-green-700">Transaction Hash:</dt>
            <dd className="text-green-800 break-all">
              {registrationResult.txHash}
            </dd>
            <dt className="font-medium text-green-700">NFT Contract:</dt>
            <dd className="text-green-800 break-all">
              {registrationResult.spgNftContract}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
}
