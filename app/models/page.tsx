"use client";

import { useEffect, useState } from "react";
import ModelCard from "../components/ModelCard";
import { useStoryProtocol } from "../hooks/useStoryProtocol";
import ModelRegistrationForm from "../components/ModelRegistrationForm";

interface Model {
  url: string;
  fileName: string;
  ipId: string;
  price?: string;
  description?: string;
  creator?: string;
  category?: string;
  isCommercial?: boolean;
  royaltyPercentage?: number;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const { isInitialized } = useStoryProtocol();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    // Fetch models from your backend/storage
    const fetchModels = async () => {
      const response = await fetch("/api/models");
      const data = await response.json();
      // Transform the data to match the Model interface if necessary
      const transformedData = data.map((item: any) => ({
        url: item.mediaUrl || item.thumbnailUrl,
        fileName: item.name,
        ipId: item.ipId,
        price: item.price,
        description: item.description,
        creator: item.creator,
        category: item.category,
        isCommercial: item.isCommercial,
        royaltyPercentage: item.royaltyPercentage,
      }));
      setModels(transformedData);
    };

    fetchModels();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">3D Models Marketplace</h1>
        <button
          onClick={() => setShowRegistrationForm(!showRegistrationForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showRegistrationForm ? "View Models" : "Register New Model"}
        </button>
      </div>

      {!isInitialized && (
        <div className="mb-8 p-4 bg-yellow-500/10 text-yellow-500 rounded-lg">
          Connect your wallet to interact with models
        </div>
      )}

      {showRegistrationForm ? (
        <ModelRegistrationForm />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <ModelCard key={model.ipId} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}
