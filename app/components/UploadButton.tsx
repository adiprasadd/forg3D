"use client";

import { useState } from "react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/app/lib/s3/config";

interface UploadButtonProps {
  onUploadComplete?: (result: { url: string; key: string }) => void;
  className?: string;
  label?: string;
}

export default function UploadButton({
  onUploadComplete,
  className = "",
  label = "Upload",
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File too large (max 100MB)");
      }

      // Get presigned URL
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, fileUrl, key } = await response.json();

      // Upload file directly to S3
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      onUploadComplete?.({ url: fileUrl, key });
    } catch (err) {
      console.error("Error uploading:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className={`inline-block ${className}`}>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={isUploading}
        className="hidden"
        accept={ALLOWED_FILE_TYPES.join(",")}
      />
      <span
        className={`inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer
          ${
            isUploading ? "opacity-50" : "hover:bg-blue-600"
          } transition-colors`}
      >
        {isUploading ? "Uploading..." : label}
      </span>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </label>
  );
}
