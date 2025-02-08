import { NextResponse } from "next/server";
import { StoryClient } from "@story-protocol/core-sdk";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import { createAndRegisterIPAsset } from "@/app/lib/story-protocol/ip-asset";

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
    const data = await request.json();
    const { name, description, fileUrl, fileId } = data;

    // Validate required fields
    if (!name || !description || !fileUrl || !fileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create IP Asset with Story Protocol
    const client = storyProtocol.getClient();
    if (!client) {
      return NextResponse.json(
        { error: "Story Protocol client not initialized" },
        { status: 500 }
      );
    }

    const ipAsset = await createAndRegisterIPAsset(client, {
      name,
      symbol: name.slice(0, 5).toUpperCase(),
      metadata: {
        uri: fileUrl,
        hash: fileId,
      },
    });

    // Here you would typically also save the model data to your database
    // const model = await db.models.create({
    //   name,
    //   description,
    //   fileUrl,
    //   fileId,
    //   ipAssetId: ipAsset.ipId,
    // });

    return NextResponse.json({
      id: ipAsset.ipId,
      ...data,
    });
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 }
    );
  }
}
