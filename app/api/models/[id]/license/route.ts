import { NextResponse } from "next/server";
import { storyProtocol } from "@/app/lib/story-protocol/client";
import { registerAndAttachLicenseTerms } from "@/app/lib/story-protocol/ip-asset";

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

    // Register and attach license terms
    const response = await registerAndAttachLicenseTerms(client, {
      ipId: params.id,
      mintingFee: BigInt(data.mintingFee || 0),
      revShare: data.revShare || 0,
      commercial: data.commercial,
      modifications: data.modifications,
    });

    return NextResponse.json({
      success: true,
      licenseTermsId: response.licenseTermsId,
      txHash: response.txHash,
    });
  } catch (error) {
    console.error("Error creating license:", error);
    return NextResponse.json(
      { error: "Failed to create license" },
      { status: 500 }
    );
  }
}
