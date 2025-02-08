import { NextResponse } from "next/server";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import { payRoyalty } from "@/app/lib/story-protocol/royalty";

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
    const { amount, payerIpId } = data;

    const response = await payRoyalty(client, {
      receiverIpId: params.id as `0x${string}`,
      payerIpId: payerIpId as `0x${string}` | undefined,
      amount: BigInt(amount),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing royalty payment:", error);
    return NextResponse.json(
      { error: "Failed to process royalty payment" },
      { status: 500 }
    );
  }
}
