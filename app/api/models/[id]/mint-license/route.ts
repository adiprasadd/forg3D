import { NextResponse } from "next/server";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import { mintLicenseToken } from "@/app/lib/story-protocol/license-token";

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
    const { licenseTermsId, receiver, amount, maxMintingFee, maxRevenueShare } =
      data;

    const response = await mintLicenseToken(client, {
      licenseTermsId,
      licensorIpId: params.id,
      receiver,
      amount,
      maxMintingFee: maxMintingFee ? BigInt(maxMintingFee) : undefined,
      maxRevenueShare,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error minting license token:", error);
    return NextResponse.json(
      { error: "Failed to mint license token" },
      { status: 500 }
    );
  }
}
