"use client";

import { useEffect, useState } from "react";
import { useStoryProtocol } from "@/app/hooks/useStoryProtocol";
import { ModelViewer } from "@/app/components/ModelViewer";
import { LicenseForm } from "@/app/components/LicenseForm";
import { LicenseTerms } from "@/app/lib/story-protocol/licensing";
import { useLicenseMinting } from "@/app/hooks/useLicenseMinting";
import { useRoyaltyPayment } from "@/app/hooks/useRoyaltyPayment";

interface ModelDetails {
  id: number;
  name: string;
  creator: string;
  price: string;
  description: string;
  license: string;
  fileFormats: string[];
  polyCount: string;
  textured: boolean;
  rigged: boolean;
  createdAt: string;
  ipAssetId: string;
}

export default function ModelPage({ params }: { params: { id: string } }) {
  const { client } = useStoryProtocol();
  const { mintLicense, isMinting, error: mintingError } = useLicenseMinting();
  const { payRoyalty, isProcessing, error: paymentError } = useRoyaltyPayment();
  const [model, setModel] = useState<ModelDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLicenseForm, setShowLicenseForm] = useState(false);

  useEffect(() => {
    fetchModelDetails();
  }, [params.id]);

  const fetchModelDetails = async () => {
    try {
      const response = await fetch(`/api/models/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch model details");
      const data = await response.json();
      setModel(data);
    } catch (err) {
      setError("Failed to load model details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLicenseSubmit = async (terms: LicenseTerms) => {
    if (!client || !model) return;

    try {
      const response = await fetch(`/api/models/${model.id}/license`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(terms),
      });

      if (!response.ok) throw new Error("Failed to create license");
      const { licenseTermsId } = await response.json();

      await mintLicense({
        modelId: model.id.toString(),
        licenseTermsId,
        receiver: client.account.address,
      });

      setShowLicenseForm(false);
    } catch (error) {
      console.error("Error creating license:", error);
    }
  };

  const handleTip = async () => {
    if (!client || !model) return;
    try {
      await payRoyalty({
        modelId: model.id.toString(),
        amount: "1000000000000000000", // 1 WIP
      });
      // Add success toast
    } catch (error) {
      console.error("Error tipping:", error);
      // Add error toast
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-2 gap-12">
          <div className="bg-gray-900 rounded-xl aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-900 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-900 rounded w-1/3 animate-pulse" />
            <div className="h-32 bg-gray-900 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 text-center">
        <p className="text-red-400 mb-4">{error || "Model not found"}</p>
        <button
          onClick={fetchModelDetails}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid grid-cols-2 gap-12">
        <div>
          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-square">
            <ModelViewer modelId={model.id} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900 rounded-lg">
              <h3 className="font-medium mb-2">File Formats</h3>
              <p className="text-gray-400">{model.fileFormats.join(", ")}</p>
            </div>
            <div className="p-4 bg-gray-900 rounded-lg">
              <h3 className="font-medium mb-2">Poly Count</h3>
              <p className="text-gray-400">{model.polyCount}</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{model.name}</h1>
          <p className="text-gray-400 mb-6">By {model.creator}</p>

          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{model.price}</span>
              <div className="space-x-4">
                <button
                  onClick={handleTip}
                  disabled={isProcessing}
                  className="px-6 py-3 border-2 border-blue-500 rounded-lg hover:bg-blue-500/10 transition font-semibold disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Tip Creator"}
                </button>
                <button
                  onClick={() => setShowLicenseForm(true)}
                  className="px-8 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  Purchase License
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-300">{model.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Technical Details</h2>
              <ul className="space-y-2 text-gray-300">
                <li>File Formats: {model.fileFormats.join(", ")}</li>
                <li>Poly Count: {model.polyCount}</li>
                <li>Textured: {model.textured ? "Yes" : "No"}</li>
                <li>Rigged: {model.rigged ? "Yes" : "No"}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">License Information</h2>
              <p className="text-gray-300">{model.license}</p>
            </div>
          </div>
        </div>
      </div>

      {showLicenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">Purchase License</h2>
            <LicenseForm
              onSubmit={handleLicenseSubmit}
              onCancel={() => setShowLicenseForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
