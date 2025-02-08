import { LicenseTerms, LicensingConfig } from "@story-protocol/core-sdk";
import { toHex, zeroAddress, zeroHash } from "viem";
import { StoryClient } from "@story-protocol/core-sdk";
import { STORY_PROTOCOL_CONFIG } from "./config";

export async function attachExistingLicenseTerms(
  client: StoryClient,
  params: {
    licenseTermsId: string;
    ipId: string;
  }
) {
  try {
    const response = await client.license.attachLicenseTerms({
      licenseTermsId: params.licenseTermsId,
      ipId: params.ipId,
      txOptions: { waitForTransaction: true },
    });

    return response;
  } catch (error) {
    console.error("Error attaching license terms:", error);
    throw error;
  }
}

export async function registerAndAttachLicenseTerms(
  client: StoryClient,
  params: {
    ipId: string;
    mintingFee: bigint;
    revShare: number;
    commercial: boolean;
    modifications: boolean;
  }
) {
  try {
    const licenseTerms: LicenseTerms = {
      transferable: true,
      royaltyPolicy: STORY_PROTOCOL_CONFIG.RoyaltyPolicyLAP,
      defaultMintingFee: params.mintingFee,
      expiration: BigInt(0),
      commercialUse: params.commercial,
      commercialAttribution: true,
      commercializerChecker: zeroAddress,
      commercializerCheckerData: zeroAddress,
      commercialRevShare: params.revShare,
      commercialRevCeiling: BigInt(0),
      derivativesAllowed: params.modifications,
      derivativesAttribution: true,
      derivativesApproval: false,
      derivativesReciprocal: true,
      derivativeRevCeiling: BigInt(0),
      currency: STORY_PROTOCOL_CONFIG.WIP_TOKEN_ADDRESS,
      uri: "",
    };

    const licensingConfig: LicensingConfig = {
      isSet: false,
      mintingFee: BigInt(0),
      licensingHook: zeroAddress,
      hookData: zeroHash,
      commercialRevShare: 0,
      disabled: false,
      expectMinimumGroupRewardShare: 0,
      expectGroupRewardPool: zeroAddress,
    };

    const response = await client.ipAsset.registerPilTermsAndAttach({
      ipId: params.ipId,
      licenseTermsData: [{ terms: licenseTerms, licensingConfig }],
      txOptions: { waitForTransaction: true },
    });

    return response;
  } catch (error) {
    console.error("Error registering and attaching license terms:", error);
    throw error;
  }
}

export async function registerIPAssetWithLicense(
  client: StoryClient,
  params: {
    nftContract: string;
    tokenId: string;
    mintingFee: bigint;
    revShare: number;
    commercial: boolean;
    modifications: boolean;
    metadata: {
      uri: string;
      hash: string;
    };
  }
) {
  try {
    const licenseTerms: LicenseTerms = {
      transferable: true,
      royaltyPolicy: STORY_PROTOCOL_CONFIG.RoyaltyPolicyLAP,
      defaultMintingFee: params.mintingFee,
      expiration: BigInt(0),
      commercialUse: params.commercial,
      commercialAttribution: true,
      commercializerChecker: zeroAddress,
      commercializerCheckerData: zeroAddress,
      commercialRevShare: params.revShare,
      commercialRevCeiling: BigInt(0),
      derivativesAllowed: params.modifications,
      derivativesAttribution: true,
      derivativesApproval: false,
      derivativesReciprocal: true,
      derivativeRevCeiling: BigInt(0),
      currency: STORY_PROTOCOL_CONFIG.WIP_TOKEN_ADDRESS,
      uri: "",
    };

    const licensingConfig: LicensingConfig = {
      isSet: false,
      mintingFee: BigInt(0),
      licensingHook: zeroAddress,
      hookData: zeroHash,
      commercialRevShare: 0,
      disabled: false,
      expectMinimumGroupRewardShare: 0,
      expectGroupRewardPool: zeroAddress,
    };

    const response = await client.ipAsset.registerIpAndAttachPilTerms({
      nftContract: params.nftContract,
      tokenId: params.tokenId,
      licenseTermsData: [{ terms: licenseTerms, licensingConfig }],
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
    console.error("Error registering IP asset with license:", error);
    throw error;
  }
}

interface RegisterIPAssetParams {
  nftContract: `0x${string}`;
  tokenId: string;
  metadata: {
    uri: string;
    hash: string;
  };
}

interface CreateAndRegisterIPAssetParams {
  name: string;
  symbol: string;
  metadata: {
    uri: string;
    hash: string;
  };
}

// Add validation helper
function validateMetadata(metadata: { uri: string; hash: string }) {
  if (!metadata.uri || !metadata.hash) {
    throw new Error("Invalid metadata: URI and hash are required");
  }

  if (!metadata.uri.startsWith("http") && !metadata.uri.startsWith("ipfs")) {
    throw new Error("Invalid metadata URI format");
  }
}

// Update registerIPAsset with validation
export async function registerIPAsset(
  client: StoryClient,
  params: RegisterIPAssetParams
) {
  try {
    validateMetadata(params.metadata);

    const response = await client.ipAsset.register({
      nftContract: params.nftContract,
      tokenId: params.tokenId,
      ipMetadata: {
        ipMetadataURI: params.metadata.uri,
        ipMetadataHash: toHex(params.metadata.hash, { size: 32 }),
        nftMetadataHash: toHex(params.metadata.hash, { size: 32 }),
        nftMetadataURI: params.metadata.uri,
      },
      txOptions: {
        waitForTransaction: true,
        confirmations: 1, // Add confirmation requirement
      },
    });

    return {
      success: true,
      txHash: response.txHash,
      ipId: response.ipId,
    };
  } catch (error) {
    console.error("Error registering IP asset:", error);
    throw error;
  }
}

export async function createAndRegisterIPAsset(
  client: StoryClient,
  params: CreateAndRegisterIPAssetParams
) {
  try {
    // Create NFT collection
    const collection = await client.nftClient.createNFTCollection({
      name: params.name,
      symbol: params.symbol,
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: "",
      txOptions: { waitForTransaction: true },
    });

    // Mint and register IP
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: collection.spgNftContract as Address,
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: params.metadata.uri,
        ipMetadataHash: toHex(params.metadata.hash, { size: 32 }),
        nftMetadataHash: toHex(params.metadata.hash, { size: 32 }),
        nftMetadataURI: params.metadata.uri,
      },
      txOptions: { waitForTransaction: true },
    });

    return {
      success: true,
      txHash: response.txHash,
      ipId: response.ipId,
      tokenId: response.tokenId,
      licenseTermsId: response.licenseTermsId,
      collectionAddress: collection.spgNftContract,
    };
  } catch (error) {
    console.error("Error creating and registering IP asset:", error);
    throw error;
  }
}
