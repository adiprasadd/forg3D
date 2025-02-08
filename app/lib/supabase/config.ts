import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://drxjkdvejzngtafmrbmp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeGprZHZlanpuZ3RhZm1yYm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMTY4NzYsImV4cCI6MjA1NDU5Mjg3Nn0.ocdqqnlsafOli32KiRgTq1T5xVo9Y3TmlI8HpCyBP6I";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const ALLOWED_FILE_TYPES = [
  // 3D Models
  ".obj",
  ".mtl",
  ".gltf",
  ".usdz",
  ".glb",
  ".fbx",
  ".blend",
  // Images
  ".jpg",
  ".jpeg",
  ".png",
  // Textures
  ".tga",
  ".exr",
  ".tif",
  ".bmp",
  // Lighting
  ".hdr",
];

export const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB total file size
