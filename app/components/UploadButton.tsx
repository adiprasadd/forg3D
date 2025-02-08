"use client";

import { useState } from "react";

interface UploadButtonProps {
  onUploadComplete?: (result: { url: string; fileName: string }) => void;
  className?: string;
  label?: string;
}

const ALLOWED_FILE_TYPES = [
  ".obj",
  ".mtl",
  ".gltf",
  ".usdz",
  ".glb",
  ".fbx",
  ".blend",
  ".jpg",
  ".jpeg",
  ".png",
  ".tga",
  ".exr",
  ".tif",
  ".bmp",
  ".hdr",
];

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

      // Validate file type
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
        throw new Error(`File type ${fileExt} not supported`);
      }

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload to local API endpoint
      const response = await fetch("/api/upload/local", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const result = await response.json();
      onUploadComplete?.(result);
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
