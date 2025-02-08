"use client";

import { useState } from "react";

interface FileUploadProps {
  onUploadComplete?: (result: { url: string; publicId: string }) => void;
  className?: string;
}

export default function FileUpload({
  onUploadComplete,
  className = "",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "models");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      onUploadComplete?.(result);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <label className="block">
        <span className="sr-only">Choose file</span>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </label>
      {isUploading && (
        <p className="mt-2 text-sm text-gray-500">Uploading...</p>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
