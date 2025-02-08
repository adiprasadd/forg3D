"use client";

import { useState } from "react";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_CHUNK_SIZE,
} from "@/app/lib/supabase/config";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadChunk = async (
    chunk: Blob,
    fileName: string,
    partNumber: number,
    totalChunks: number
  ) => {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileName", fileName);
    formData.append("partNumber", partNumber.toString());
    formData.append("totalChunks", totalChunks.toString());

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Chunk upload failed");
    }

    return response.json();
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`
        );
      }

      // Validate file type
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
        throw new Error(`File type ${fileExt} not supported`);
      }

      // Split file into chunks
      const chunks: Blob[] = [];
      let offset = 0;
      while (offset < file.size) {
        chunks.push(file.slice(offset, offset + MAX_CHUNK_SIZE));
        offset += MAX_CHUNK_SIZE;
      }

      // Upload chunks
      const uploadPromises = chunks.map((chunk, index) =>
        uploadChunk(chunk, file.name, index + 1, chunks.length)
      );

      // Track progress
      let completedChunks = 0;
      await Promise.all(
        uploadPromises.map(async (promise) => {
          await promise;
          completedChunks++;
          setUploadProgress((completedChunks / chunks.length) * 100);
        })
      );

      // Get final URL
      const finalResponse = await fetch("/api/upload/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          totalChunks: chunks.length,
        }),
      });

      const result = await finalResponse.json();
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
        {isUploading ? `Uploading ${uploadProgress.toFixed(1)}%` : label}
      </span>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </label>
  );
}
