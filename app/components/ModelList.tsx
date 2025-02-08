"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Model {
  id: number;
  name: string;
  description: string;
  price: string;
  creator: string;
  createdAt: string;
  status: "active" | "pending" | "sold";
  thumbnailUrl: string;
}

export function ModelList() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models");
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      setModels(data.models);
    } catch (err) {
      setError("Failed to load models");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-800" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-800 rounded w-2/3" />
              <div className="h-4 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchModels}
          className="mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {models.map((model) => (
        <div
          key={model.id}
          className="bg-gray-900 rounded-xl overflow-hidden group"
        >
          <div className="relative h-48 bg-gray-800">
            {model.thumbnailUrl && (
              <img
                src={model.thumbnailUrl}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Link
                href={`/models/${model.id}`}
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold truncate">{model.name}</h3>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  model.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : model.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {model.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {model.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-bold">{model.price}</span>
              <span className="text-sm text-gray-400">
                {new Date(model.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
