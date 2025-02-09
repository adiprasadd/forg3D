import { NextResponse } from "next/server";
import { StoryClient } from "@story-protocol/core-sdk";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import { createAndRegisterIPAsset } from "@/app/lib/story-protocol/ip-asset";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const models = [];

    // Read all model directories
    const dirs = fs.readdirSync(uploadsDir);
    for (const dir of dirs) {
      const metadataPath = path.join(uploadsDir, dir, "metadata.json");
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
        models.push({
          id: dir,
          ...metadata,
          thumbnailUrl: `/uploads/${dir}/cover.png`,
          modelUrl: `/uploads/${dir}/model.gltf`,
        });
      }
    }

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("\n📝 Received model data:", data);

    if (!data.modelUrl) {
      console.error("Missing modelUrl in request data");
      return NextResponse.json({ error: "Missing modelUrl" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const modelDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      data.modelUrl
    );
    console.log("Model directory:", modelDir);

    if (!fs.existsSync(modelDir)) {
      console.error("Model directory not found:", modelDir);
      return NextResponse.json(
        { error: "Model directory not found" },
        { status: 404 }
      );
    }

    const metadataPath = path.join(modelDir, "metadata.json");
    let existingMetadata = {};

    // Read existing metadata if it exists
    if (fs.existsSync(metadataPath)) {
      try {
        const rawMetadata = fs.readFileSync(metadataPath, "utf-8");
        existingMetadata = JSON.parse(rawMetadata);
        console.log("📖 Existing metadata:", existingMetadata);
      } catch (error) {
        console.warn("⚠️ Error reading existing metadata:", error);
      }
    }

    // Merge existing metadata with new data
    const metadata = {
      ...existingMetadata,
      name: data.name,
      description: data.description,
      price: data.price,
      royaltyPercentage: data.royaltyPercentage,
      ipId: data.ipId, // Story Protocol IP Asset ID
      txHash: data.txHash,
      spgNftContract: data.spgNftContract,
      tokenId: data.tokenId,
      licenseTokenId: data.licenseTokenId,
      licenseTermsIds: data.licenseTermsIds,
      lastModified: new Date().toISOString(),
    };

    console.log("\n💾 Saving updated metadata:", metadata);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log("✅ Metadata saved successfully at:", metadataPath);

    return NextResponse.json({
      success: true,
      metadata,
      path: metadataPath,
    });
  } catch (error) {
    console.error("Error saving model:", error);
    return NextResponse.json(
      { error: "Failed to save model" },
      { status: 500 }
    );
  }
}
