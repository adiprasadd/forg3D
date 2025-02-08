"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import UploadButton from "../components/UploadButton";

interface ModelForm {
  name: string;
  description: string;
  fileUrl?: string;
  fileId?: string;
}

export default function CreatePage() {
  const [formData, setFormData] = useState<ModelForm>({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    publicId: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) {
      setError("Please upload a model file first");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const modelData = {
        ...formData,
        fileUrl: uploadedFile.url,
        fileId: uploadedFile.publicId,
      };

      const response = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelData),
      });

      if (!response.ok) {
        throw new Error("Failed to create model");
      }

      // Redirect to the model page or show success message
      const result = await response.json();
      window.location.href = `/models/${result.id}`;
    } catch (err) {
      console.error("Error creating model:", err);
      setError(err instanceof Error ? err.message : "Failed to create model");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Navigation />
      <div className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Create New Model</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-800/50 rounded-xl p-8">
              <label className="block text-sm font-medium mb-4">
                Upload Model
              </label>
              <UploadButton
                onUploadComplete={(result) => {
                  setUploadedFile(result);
                  setError(null);
                }}
                label="Choose File to Upload"
                className="w-full"
              />
              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 font-medium">
                    File uploaded successfully!
                  </p>
                  <p className="text-sm text-gray-400 break-all mt-1">
                    {uploadedFile.url.split("/").pop()}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Model Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter model name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe your model"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !uploadedFile}
                className={`w-full px-6 py-3 bg-blue-500 rounded-lg transition font-medium
                  ${
                    isSubmitting || !uploadedFile
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
              >
                {isSubmitting ? "Creating..." : "Create Model"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
