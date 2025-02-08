import { NextResponse } from "next/server";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import {
  claimRevenue,
  getClaimableRevenue,
} from "@/app/lib/story-protocol/revenue";

export async function GET(
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

    const claimable = await getClaimableRevenue(client, {
      ancestorIpId: params.id as `0x${string}`,
      claimer: params.id as `0x${string}`,
    });

    return NextResponse.json({ claimable });
  } catch (error) {
    console.error("Error getting claimable revenue:", error);
    return NextResponse.json(
      { error: "Failed to get claimable revenue" },
      { status: 500 }
    );
  }
}

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
    const { childIpIds, royaltyPolicies } = data;

    const response = await claimRevenue(client, {
      ancestorIpId: params.id as `0x${string}`,
      claimer: params.id as `0x${string}`,
      childIpIds,
      royaltyPolicies,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error claiming revenue:", error);
    return NextResponse.json(
      { error: "Failed to claim revenue" },
      { status: 500 }
    );
  }
}
