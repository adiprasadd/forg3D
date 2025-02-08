"use client";

import { useState } from "react";
import UploadButton from "@/app/components/UploadButton";

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Model</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Model
              </label>
              <UploadButton
                onUploadComplete={(result) => {
                  setUploadedFile(result);
                  setError(null);
                }}
                label="Choose 3D Model"
              />
            </div>

            {uploadedFile && (
              <div className="mt-4">
                <p className="text-green-500">
                  File uploaded successfully:{" "}
                  {uploadedFile.url.split("/").pop()}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
