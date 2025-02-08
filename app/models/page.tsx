"use client";

import { useEffect, useState } from "react";
import ModelCard from "../components/ModelCard";
import { useStoryProtocol } from "../hooks/useStoryProtocol";

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const { isInitialized } = useStoryProtocol();

  useEffect(() => {
    // Fetch models from your backend/storage
    const fetchModels = async () => {
      const response = await fetch("/api/models");
      const data = await response.json();
      setModels(data);
    };

    fetchModels();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">3D Models Marketplace</h1>
      {!isInitialized && (
        <div className="mb-8 p-4 bg-yellow-500/10 text-yellow-500 rounded-lg">
          Connect your wallet to purchase models
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <ModelCard key={model.ipId} model={model} />
        ))}
      </div>
    </div>
  );
}
