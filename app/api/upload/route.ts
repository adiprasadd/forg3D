import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { ALLOWED_FILE_TYPES } from "@/app/lib/s3/config";

export async function POST(request: Request) {
  try {
    // Log the incoming request headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log("📨 Request headers:", headers);

    const formData = await request.formData();

    // Log all form data entries
    console.log("📝 Form data entries:", Array.from(formData.entries()));

    // Get the model file
    const modelFile = formData.get("model");
    const coverFile = formData.get("cover");
    const baseFileName = formData.get("baseFileName");
    const metadata = formData.get("metadata");

    if (!modelFile || !(modelFile instanceof File)) {
      console.error("❌ No valid model file provided. Available fields:", {
        fields: Array.from(formData.keys()),
        modelFile: modelFile ? typeof modelFile : "not provided",
      });
      return NextResponse.json(
        {
          error: "No valid model file provided",
          availableFields: Array.from(formData.keys()),
        },
        { status: 400 }
      );
    }

    // Log file details
    console.log("📁 Received files:", {
      model: {
        name: modelFile.name,
        type: modelFile.type || "application/octet-stream",
        size: modelFile.size,
      },
      cover:
        coverFile instanceof File
          ? {
              name: coverFile.name,
              type: coverFile.type,
              size: coverFile.size,
            }
          : "not provided",
      baseFileName,
      metadata: metadata ? JSON.parse(metadata as string) : "not provided",
    });

    // Validate file extension
    const ext = path.extname(modelFile.name).toLowerCase();
    console.log("🔍 File extension:", ext);

    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      console.error(
        `❌ Invalid file type: ${ext}. Allowed types:`,
        ALLOWED_FILE_TYPES
      );
      return NextResponse.json(
        {
          error: `File type ${ext} not supported`,
          allowedTypes: ALLOWED_FILE_TYPES,
          receivedType: ext,
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = path.basename(modelFile.name, ext);
    const fileName = `${timestamp}-${originalName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", fileName);

    // Create directory
    await mkdir(uploadDir, { recursive: true });
    console.log("📂 Created directory:", uploadDir);

    // For GLTF files, we need to handle all associated files
    if (ext === ".gltf") {
      // Get all files from the form data
      const files = Array.from(formData.entries()).filter(
        ([key, value]) =>
          value instanceof File && key !== "cover" && key !== "metadata"
      );

      // Create textures directory if needed
      const texturesDir = path.join(uploadDir, "textures");
      await mkdir(texturesDir, { recursive: true });

      // Save each file in its appropriate location
      for (const [key, file] of files) {
        if (!(file instanceof File)) continue;

        const fileExt = path.extname(file.name).toLowerCase();
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Determine the appropriate path based on file type
        let filePath;
        if (fileExt === ".bin") {
          filePath = path.join(uploadDir, "scene.bin");
        } else if ([".png", ".jpg", ".jpeg"].includes(fileExt)) {
          filePath = path.join(texturesDir, file.name);
        } else {
          filePath = path.join(uploadDir, file.name);
        }

        await writeFile(filePath, fileBuffer);
        console.log(`💾 Saved file to: ${filePath}`);
      }
    } else {
      // Handle non-GLTF files as before
      const modelPath = path.join(uploadDir, `model${ext}`);
      const modelBuffer = Buffer.from(await modelFile.arrayBuffer());
      await writeFile(modelPath, modelBuffer);
      console.log("💾 Saved model file to:", modelPath);
    }

    // Save the cover image if provided
    let coverPath;
    let coverExt;
    if (coverFile instanceof File) {
      coverExt = path.extname(coverFile.name).toLowerCase();
      coverPath = path.join(uploadDir, `cover${coverExt}`);
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      await writeFile(coverPath, coverBuffer);
      console.log("💾 Saved cover image to:", coverPath);
    }

    // Save metadata if provided
    if (metadata) {
      const metadataPath = path.join(uploadDir, "metadata.json");
      await writeFile(metadataPath, metadata as string);
      console.log("💾 Saved metadata to:", metadataPath);
    }

    // Return success response
    interface UploadResponse {
      success: boolean;
      fileKey: string;
      originalName: string;
      size: number;
      type: string;
      path: string;
      coverPath?: string;
    }

    const response: UploadResponse = {
      success: true,
      fileKey: fileName,
      originalName: modelFile.name,
      size: modelFile.size,
      type: modelFile.type || "application/octet-stream",
      path: `/uploads/${fileName}/model${ext}`,
    };

    // Add cover path if it exists
    if (coverPath && coverExt) {
      response.coverPath = `/uploads/${fileName}/cover${coverExt}`;
    }

    console.log("✅ Returning response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
