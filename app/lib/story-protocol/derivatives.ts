import { StoryClient, DerivativeData } from "@story-protocol/core-sdk";
import { toHex } from "viem";

interface RegisterDerivativeParams {
  childIpId: `0x${string}`;
  parentIpIds: `0x${string}`[];
  licenseTermsIds: string[];
  maxMintingFee?: bigint;
  maxRts?: number;
  maxRevenueShare?: number;
}

interface RegisterDerivativeWithTokenParams {
  childIpId: `0x${string}`;
  licenseTokenIds: string[];
  maxRts?: number;
}

interface RegisterNFTAsDerivativeParams {
  nftContract: `0x${string}`;
  tokenId: string;
  parentIpIds: `0x${string}`[];
  licenseTermsIds: string[];
  metadata: {
    uri: string;
    hash: string;
  };
}

export async function registerDerivative(
  client: StoryClient,
  params: RegisterDerivativeParams
) {
  try {
    const response = await client.ipAsset.registerDerivative({
      childIpId: params.childIpId,
      parentIpIds: params.parentIpIds,
      licenseTermsIds: params.licenseTermsIds,
      maxMintingFee: params.maxMintingFee || BigInt(0),
      maxRts: params.maxRts || 100_000_000,
      maxRevenueShare: params.maxRevenueShare || 100,
      txOptions: { waitForTransaction: true },
    });

    return response;
  } catch (error) {
    console.error("Error registering derivative:", error);
    throw error;
  }
}

export async function registerDerivativeWithLicenseTokens(
  client: StoryClient,
  params: RegisterDerivativeWithTokenParams
) {
  try {
    const response = await client.ipAsset.registerDerivativeWithLicenseTokens({
      childIpId: params.childIpId,
      licenseTokenIds: params.licenseTokenIds,
      maxRts: params.maxRts || 100_000_000,
      txOptions: { waitForTransaction: true },
    });

    return response;
  } catch (error) {
    console.error("Error registering derivative with license tokens:", error);
    throw error;
  }
}

export async function registerNFTAsDerivative(
  client: StoryClient,
  params: RegisterNFTAsDerivativeParams
) {
  try {
    const derivData: DerivativeData = {
      parentIpIds: params.parentIpIds,
      licenseTermsIds: params.licenseTermsIds,
      maxMintingFee: BigInt(0),
      maxRts: 100_000_000,
      maxRevenueShare: 100,
    };

    const response = await client.ipAsset.registerDerivativeIp({
      nftContract: params.nftContract,
      tokenId: params.tokenId,
      derivData,
      ipMetadata: {
        ipMetadataURI: params.metadata.uri,
        ipMetadataHash: toHex(params.metadata.hash, { size: 32 }),
        nftMetadataHash: toHex(params.metadata.hash, { size: 32 }),
        nftMetadataURI: params.metadata.uri,
      },
      txOptions: { waitForTransaction: true },
    });

    return response;
  } catch (error) {
    console.error("Error registering NFT as derivative:", error);
    throw error;
  }
}
