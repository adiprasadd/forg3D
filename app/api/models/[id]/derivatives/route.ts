import { NextResponse } from "next/server";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import {
  registerDerivative,
  registerDerivativeWithLicenseTokens,
  registerNFTAsDerivative,
} from "@/app/lib/story-protocol/derivatives";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = storyProtocol.getClient();
    if (!client) {
      return NextResponse.json(
        { error: "Story Protocol client not initialized" },
        { status: 500 }
      );
    }

    const data = await request.json();
    const { type, ...derivativeParams } = data;

    let response;

    switch (type) {
      case "direct":
        response = await registerDerivative(client, {
          ...derivativeParams,
          parentIpIds: [params.id as `0x${string}`],
        });
        break;

      case "with_license":
        response = await registerDerivativeWithLicenseTokens(client, {
          ...derivativeParams,
        });
        break;

      case "nft":
        response = await registerNFTAsDerivative(client, {
          ...derivativeParams,
          parentIpIds: [params.id as `0x${string}`],
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid derivative registration type" },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error registering derivative:", error);
    return NextResponse.json(
      { error: "Failed to register derivative" },
      { status: 500 }
    );
  }
}
