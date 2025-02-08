import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "./config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.cloudName,
  api_key: CLOUDINARY_CONFIG.apiKey,
  api_secret: CLOUDINARY_CONFIG.apiSecret,
  secure: true,
});

interface UploadParams {
  file: string | Buffer;
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
  };
}

export async function uploadToCloudinary(params: UploadParams) {
  try {
    const response = await cloudinary.uploader.upload(params.file, {
      folder: params.folder || "models",
      transformation: params.transformation,
      resource_type: "auto",
    });

    return {
      success: true,
      url: response.secure_url,
      publicId: response.public_id,
      format: response.format,
      width: response.width,
      height: response.height,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}
