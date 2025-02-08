import { StoryClient } from "@story-protocol/core-sdk";

interface MintLicenseParams {
  licenseTermsId: string;
  licensorIpId: string;
  receiver: string;
  amount?: number;
  maxMintingFee?: bigint;
  maxRevenueShare?: number;
}

export async function mintLicenseToken(
  client: StoryClient,
  params: MintLicenseParams
) {
  try {
    const response = await client.license.mintLicenseTokens({
      licenseTermsId: params.licenseTermsId,
      licensorIpId: params.licensorIpId,
      receiver: params.receiver,
      amount: params.amount || 1,
      maxMintingFee: params.maxMintingFee || BigInt(0),
      maxRevenueShare: params.maxRevenueShare || 100,
      txOptions: { waitForTransaction: true },
    });

    return {
      success: true,
      txHash: response.txHash,
      licenseTokenIds: response.licenseTokenIds,
    };
  } catch (error) {
    console.error("Error minting license token:", error);
    throw error;
  }
}
