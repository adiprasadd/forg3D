"use client";

import { useState } from "react";
import { useStoryProtocol } from "@/app/hooks/useStoryProtocol";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/app/lib/s3/config";

interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
}

export function ModelUploader() {
  const { client } = useStoryProtocol();
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: 'idle'
  });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    modelFile: null as File | null,
    previewImage: null as File | null,
    price: "",
    royaltyPercentage: "10",
    licenseType: "standard",
  });

  const validateFile = (file: File) => {
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      throw new Error(`File type ${ext} not supported`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }
  };

  const uploadToS3 = async (file: File, presignedUrl: string) => {
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadState(prev => ({ ...prev, progress }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        validateFile(file);
        setFormData(prev => ({
          ...prev,
          [e.target.name]: file
        }));
        setUploadState(prev => ({ ...prev, error: undefined }));
      } catch (error) {
        setUploadState(prev => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Invalid file'
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !formData.modelFile) return;

    try {
      setUploadState({ progress: 0, status: 'uploading' });

      // Get presigned URL for model file
      const modelFormData = new FormData();
      modelFormData.append("file", formData.modelFile);
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: modelFormData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to get upload URL");
      }
      
      const { uploadUrl, fileKey } = await uploadResponse.json();

      // Upload to S3
      await uploadToS3(formData.modelFile, uploadUrl);

      // Upload preview image if exists
      let previewImageKey;
      if (formData.previewImage) {
        const previewFormData = new FormData();
        previewFormData.append("file", formData.previewImage);
        
        const previewResponse = await fetch("/api/upload", {
          method: "POST",
          body: previewFormData,
        });
        
        if (previewResponse.ok) {
          const { uploadUrl: previewUploadUrl, fileKey: previewKey } = await previewResponse.json();
          await uploadToS3(formData.previewImage, previewUploadUrl);
          previewImageKey = previewKey;
        }
      }

      setUploadState(prev => ({ ...prev, status: 'processing' }));

      // Register model as IP asset
      const response = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          modelUrl: fileKey,
          previewUrl: previewImageKey,
          mintingFee: formData.price,
          royaltyPercentage: formData.royaltyPercentage,
          licenseTerms: {
            type: formData.licenseType,
            commercial: true,
            modifications: true,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create model");

      setUploadState({ progress: 100, status: 'success' });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        modelFile: null,
        previewImage: null,
        price: "",
        royaltyPercentage: "10",
        licenseType: "standard",
      });

    } catch (error) {
      console.error("Error uploading model:", error);
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Model Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Model File</label>
        <input
          type="file"
          name="modelFile"
          onChange={handleFileChange}
          className="w-full"
          accept={ALLOWED_FILE_TYPES.join(',')}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Preview Image</label>
        <input
          type="file"
          name="previewImage"
          onChange={handleFileChange}
          className="w-full"
          accept=".jpg,.jpeg,.png"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price (ETH)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          step="0.001"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Royalty Percentage</label>
        <input
          type="number"
          value={formData.royaltyPercentage}
          onChange={(e) => setFormData(prev => ({ ...prev, royaltyPercentage: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
          min="0"
          max="100"
          required
        />
      </div>

      {uploadState.status !== 'idle' && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                uploadState.status === 'error' ? 'bg-red-600' : 'bg-blue-600'
              }`}
              style={{ width: `${uploadState.progress}%` }}
            ></div>
          </div>
          <p className={`mt-2 text-sm ${uploadState.status === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
            {uploadState.status === 'error' ? uploadState.error : `${uploadState.progress}% uploaded`}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={uploadState.status === 'uploading' || uploadState.status === 'processing'}
        className={`w-full px-4 py-2 rounded-lg ${
          uploadState.status === 'uploading' || uploadState.status === 'processing'
            ? 'bg-gray-600'
            : 'bg-blue-600 hover:bg-blue-700'
        } transition`}
      >
        {uploadState.status === 'uploading' ? 'Uploading...' :
         uploadState.status === 'processing' ? 'Processing...' :
         'Upload Model'}
      </button>
    </form>
  );
}