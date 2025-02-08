import { NextResponse } from "next/server";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import {
  registerIPAsset,
  createAndRegisterIPAsset,
} from "@/app/lib/story-protocol/ip-asset";
import { isAddress } from "viem";

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
    const { type, ...params } = data;

    // Validate request data
    if (type === "register") {
      if (!isAddress(params.nftContract)) {
        return NextResponse.json(
          { error: "Invalid NFT contract address" },
          { status: 400 }
        );
      }
      if (!params.tokenId) {
        return NextResponse.json(
          { error: "Token ID is required" },
          { status: 400 }
        );
      }
    } else if (type === "create") {
      if (!params.name || !params.symbol) {
        return NextResponse.json(
          { error: "Name and symbol are required" },
          { status: 400 }
        );
      }
    }

    // Validate metadata
    if (!params.metadata?.uri || !params.metadata?.hash) {
      return NextResponse.json(
        { error: "Invalid metadata: URI and hash are required" },
        { status: 400 }
      );
    }

    let response;
    switch (type) {
      case "register":
        response = await registerIPAsset(client, params);
        break;

      case "create":
        response = await createAndRegisterIPAsset(client, params);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid registration type" },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error registering IP asset:", error);
    return NextResponse.json(
      {
        error: "Failed to register IP asset",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
