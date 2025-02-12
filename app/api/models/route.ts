import { NextResponse } from "next/server";
import { StoryClient } from "@story-protocol/core-sdk";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import { createAndRegisterIPAsset } from "@/app/lib/story-protocol/ip-asset";
import fs from "fs";
import path from "path";

interface ModelData {
  ipId: string;
  tokenId: string;
  name: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  price?: string;
  royaltyPercentage?: number;
  creator: string;
  spgNftContract: string;
}

// In-memory storage for demo purposes
// In a real app, you would use a database
let models: ModelData[] = [];

export async function GET() {
  try {
    // Return all models
    return NextResponse.json(models);
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
    const client = storyProtocol.getClient();
    if (!client) {
      return NextResponse.json(
        { error: "Story Protocol client not initialized" },
        { status: 500 }
      );
    }

    const data: ModelData = await request.json();

    // Validate required fields
    if (!data.ipId || !data.name || !data.mediaUrl || !data.creator) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add model to storage
    models.push(data);

    return NextResponse.json({
      message: "Model registered successfully",
      model: data,
    });
  } catch (error) {
    console.error("Error registering model:", error);
    return NextResponse.json(
      { error: "Failed to register model" },
      { status: 500 }
    );
  }
}
