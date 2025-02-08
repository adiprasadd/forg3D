"use client";

import { useState } from "react";

interface UploadButtonProps {
  onUploadComplete: (result: { fileName: string }) => void;
  className?: string;
  label?: string;
}

interface ModelMetadata {
  name: string;
  price: number;
  description: string;
}

export default function UploadButton({
  onUploadComplete,
  className = "",
  label = "Upload Model",
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false); // Add this state
  const [metadata, setMetadata] = useState<ModelMetadata>({
    name: "",
    price: 0,
    description: "",
  });
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelFile || !coverImage) {
      setError("Please select both a model file and a cover image");
      return;
    }
  
    try {
      setIsUploading(true);
      setError(null);
      setSuccess(false);
  
      const timestamp = Date.now();
      const baseFileName = `${timestamp}-${modelFile.name.split(".")[0]}`;
  
      const formData = new FormData();
      formData.append("model", modelFile);
      formData.append("cover", coverImage);
      formData.append("metadata", JSON.stringify(metadata));
      formData.append("baseFileName", baseFileName);
  
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${errorData}`);
      }
  
      const result = await response.json();
      onUploadComplete(result);
      setSuccess(true);
      
      // Reset form
      setMetadata({ name: "", price: 0, description: "" });
      setModelFile(null);
      setCoverImage(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload New Model</h2>
      
      {success && (
        <div className="mb-4 p-4 bg-green-500 text-white rounded-lg text-center">
          Product successfully uploaded!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Model Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Model Name</label>
          <input
            type="text"
            value={metadata.name}
            onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter model name"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price ($)</label>
          <input
            type="number"
            value={metadata.price}
            onChange={(e) => setMetadata({ ...metadata, price: Number(e.target.value) })}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
            placeholder="Enter price"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            rows={4}
            placeholder="Enter model description"
          />
        </div>

        {/* 3D Model File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">3D Model File</label>
          <input
            type="file"
            onChange={(e) => setModelFile(e.target.files?.[0] || null)}
            accept=".obj,.gltf,.glb"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-400 mt-1">Supported formats: .obj, .gltf, .glb</p>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          <input
            type="file"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            accept="image/*"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-400 mt-1">Supported formats: JPG, PNG</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Model"
          )}
        </button>
      </form>
    </div>
  );
}

// "use client";

// import { useState } from "react";

// interface UploadButtonProps {
//   onUploadComplete: (result: { fileName: string }) => void;
//   className?: string;
//   label?: string;
// }

// interface ModelMetadata {
//   name: string;
//   price: number;
//   description: string;
// }

// export default function UploadButton({
//   onUploadComplete,
//   className = "",
//   label = "Upload Model",
// }: UploadButtonProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [metadata, setMetadata] = useState<ModelMetadata>({
//     name: "",
//     price: 0,
//     description: "",
//   });
//   const [modelFile, setModelFile] = useState<File | null>(null);
//   const [coverImage, setCoverImage] = useState<File | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!modelFile || !coverImage) {
//       setError("Please select both a model file and a cover image");
//       return;
//     }

//     try {
//       setIsUploading(true);
//       setError(null);

//       const timestamp = Date.now();
//       const baseFileName = `${timestamp}-${modelFile.name.split(".")[0]}`;

//       const formData = new FormData();
//       formData.append("model", modelFile);
//       formData.append("cover", coverImage);
//       formData.append("metadata", JSON.stringify(metadata));
//       formData.append("baseFileName", baseFileName);

//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Upload failed");
//       }

//       const result = await response.json();
//       onUploadComplete(result);
      
//       // Reset form
//       setMetadata({ name: "", price: 0, description: "" });
//       setModelFile(null);
//       setCoverImage(null);
//     } catch (err) {
//       console.error("Upload error:", err);
//       setError(err instanceof Error ? err.message : "Upload failed");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-center">Upload New Model</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Model Name */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Model Name</label>
//           <input
//             type="text"
//             value={metadata.name}
//             onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
//             className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//             placeholder="Enter model name"
//           />
//         </div>

//         {/* Price */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Price ($)</label>
//           <input
//             type="number"
//             value={metadata.price}
//             onChange={(e) => setMetadata({ ...metadata, price: Number(e.target.value) })}
//             className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//             min="0"
//             step="0.01"
//             placeholder="Enter price"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Description</label>
//           <textarea
//             value={metadata.description}
//             onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
//             className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//             rows={4}
//             placeholder="Enter model description"
//           />
//         </div>

//         {/* 3D Model File Upload */}
//         <div>
//           <label className="block text-sm font-medium mb-2">3D Model File</label>
//           <input
//             type="file"
//             onChange={(e) => setModelFile(e.target.files?.[0] || null)}
//             accept=".obj,.gltf,.glb"
//             className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <p className="text-sm text-gray-400 mt-1">Supported formats: .obj, .gltf, .glb</p>
//         </div>

//         {/* Cover Image Upload */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Cover Image</label>
//           <input
//             type="file"
//             onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
//             accept="image/*"
//             className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <p className="text-sm text-gray-400 mt-1">Supported formats: JPG, PNG</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="text-red-500 text-sm text-center">
//             {error}
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isUploading}
//           className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
//                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isUploading ? (
//             <span className="flex items-center justify-center">
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Uploading...
//             </span>
//           ) : (
//             "Upload Model"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";

// interface UploadButtonProps {
//   onUploadComplete?: (result: { url: string; fileName: string }) => void;
//   className?: string;
//   label?: string;
// }

// const ALLOWED_FILE_TYPES = [
//   ".obj",
//   ".mtl",
//   ".gltf",
//   ".usdz",
//   ".glb",
//   ".fbx",
//   ".blend",
//   ".jpg",
//   ".jpeg",
//   ".png",
//   ".tga",
//   ".exr",
//   ".tif",
//   ".bmp",
//   ".hdr",
// ];

// export default function UploadButton({
//   onUploadComplete,
//   className = "",
//   label = "Upload",
// }: UploadButtonProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleUpload = async (file: File) => {
//     try {
//       setIsUploading(true);
//       setError(null);

//       // Validate file type
//       const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
//       if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
//         throw new Error(`File type ${fileExt} not supported`);
//       }

//       // Create FormData
//       const formData = new FormData();
//       formData.append("file", file);

//       // Upload to local API endpoint
//       const response = await fetch("/api/upload/local", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Upload failed");
//       }

//       const result = await response.json();
//       onUploadComplete?.(result);
//     } catch (err) {
//       console.error("Error uploading:", err);
//       setError(err instanceof Error ? err.message : "Upload failed");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <label className={`inline-block ${className}`}>
//       <input
//         type="file"
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) handleUpload(file);
//         }}
//         disabled={isUploading}
//         className="hidden"
//         accept={ALLOWED_FILE_TYPES.join(",")}
//       />
//       <span
//         className={`inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer
//           ${
//             isUploading ? "opacity-50" : "hover:bg-blue-600"
//           } transition-colors`}
//       >
//         {isUploading ? "Uploading..." : label}
//       </span>
//       {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
//     </label>
//   );
// }
