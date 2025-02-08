import { NextResponse } from "next/server";
import { StoryClient } from "@story-protocol/core-sdk";
import { storyProtocol } from "@/app/lib/story-protocol/client";

export async function GET() {
  try {
    const client = storyProtocol.getClient();
    if (!client) {
      return NextResponse.json(
        { error: "Story Protocol client not initialized" },
        { status: 500 }
      );
    }

    // Fetch models from Story Protocol
    const models = await client.ipAsset.getAll();

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
    const client = storyProtocol.getClient();
    if (!client) {
      return NextResponse.json(
        { error: "Story Protocol client not initialized" },
        { status: 500 }
      );
    }

    const data = await request.json();

    // Register model as IP asset
    const response = await client.ipAsset.register({
      name: data.name,
      description: data.description,
      mediaUrl: data.modelUrl,
      licenseTerms: data.licenseTerms,
      licensingConfig: {
        mintingFee: data.mintingFee,
        royaltyPolicy: {
          royaltyType: "PERCENTAGE",
          registrationFee: "0",
          royaltyAmount: data.royaltyPercentage,
        },
      },
    });

    return NextResponse.json({ success: true, ipAssetId: response.ipAssetId });
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 }
    );
  }
}
