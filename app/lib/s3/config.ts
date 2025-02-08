import { S3Client } from "@aws-sdk/client-s3";

// Define allowed file types
export const ALLOWED_FILE_TYPES = [
  // 3D Models
  '.obj', '.mtl', '.gltf', '.usdz', '.glb', '.fbx', '.blend',
  // Images
  '.jpg', '.jpeg', '.png',
  // Textures
  '.tga', '.exr', '.tif', '.bmp',
  // Lighting
  '.hdr'
];

// Maximum file size (500MB)
export const MAX_FILE_SIZE = 500 * 1024 * 1024;

// Initialize S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});
