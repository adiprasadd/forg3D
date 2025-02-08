"use client";

import { useState } from "react";
import { useStoryProtocol } from "../hooks/useStoryProtocol";

export function ModelUploader() {
  const { client } = useStoryProtocol();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    modelFile: null as File | null,
    price: "",
    royaltyPercentage: "10",
    licenseType: "standard",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, modelFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !formData.modelFile) return;

    try {
      setIsUploading(true);

      // 1. Upload model file to IPFS
      const formDataUpload = new FormData();
      formDataUpload.append("file", formData.modelFile);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const { modelUrl } = await uploadResponse.json();

      // 2. Register model as IP asset
      const response = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          modelUrl,
          mintingFee: formData.price,
          royaltyPercentage: formData.royaltyPercentage,
          licenseTerms: {
            type: formData.licenseType,
            commercial: true,
            modifications: true,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create model");

      // Reset form
      setFormData({
        name: "",
        description: "",
        modelFile: null,
        price: "",
        royaltyPercentage: "10",
        licenseType: "standard",
      });
    } catch (error) {
      console.error("Error uploading model:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Model Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price (ETH)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Model File</label>
        <input
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Royalty Percentage
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.royaltyPercentage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                royaltyPercentage: e.target.value,
              }))
            }
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">License Type</label>
          <select
            value={formData.licenseType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, licenseType: e.target.value }))
            }
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="standard">Standard Commercial</option>
            <option value="exclusive">Exclusive Commercial</option>
            <option value="personal">Personal Use Only</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Model"}
      </button>
    </form>
  );
}