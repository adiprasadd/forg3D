import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { useWallet } from "../components/WalletProvider";
import { toHex, Address, zeroAddress } from "viem";

export interface Model3DMetadata {
  name: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  price?: string;
  creator?: string;
  category?: string;
}

interface RegisterModel3DParams extends Model3DMetadata {
  isCommercial?: boolean;
  royaltyPercentage?: number;
  upfrontFee?: string;
}

export function use3DModelRegistration() {
  const { client, isInitialized } = useStoryProtocol();
  const { address } = useWallet();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register3DModel = async ({
    name,
    description,
    mediaUrl,
    thumbnailUrl,
    isCommercial = false,
    royaltyPercentage = 10,
    upfrontFee = "0",
  }: RegisterModel3DParams) => {
    if (!client || !isInitialized) {
      throw new Error("Story Protocol client not initialized");
    }

    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsRegistering(true);
      setError(null);

      // First create a new NFT collection
      console.log("Creating new NFT collection...");
      const newCollection = await client.nftClient.createNFTCollection({
        name: `${name} Collection`,
        symbol: "3DM",
        isPublicMinting: true,
        mintOpen: true,
        mintFeeRecipient: zeroAddress,
        contractURI: "",
        txOptions: { waitForTransaction: true },
      });

      console.log("NFT Collection created:", newCollection.spgNftContract);

      // Create metadata for IP asset registration
      const ipMetadata = {
        title: name,
        description,
        modelUrl: mediaUrl,
        previewUrl: thumbnailUrl,
        attributes: [
          { key: "Category", value: "3D Model" },
          { key: "IsCommercial", value: isCommercial.toString() },
          { key: "RoyaltyPercentage", value: royaltyPercentage.toString() },
        ],
      };

      const nftMetadata = {
        name,
        description,
        image: thumbnailUrl,
        attributes: {
          category: "3D Model",
          isCommercial,
          royaltyPercentage,
        },
      };

      // Create metadata hashes
      const ipMetadataHash = toHex(JSON.stringify(ipMetadata), { size: 32 });
      const nftMetadataHash = toHex(JSON.stringify(nftMetadata), { size: 32 });

      // Register the IP asset
      console.log("Registering IP asset...");
      const response = await client.ipAsset.mintAndRegisterIp({
        spgNftContract: newCollection.spgNftContract as Address,
        allowDuplicates: true,
        ipMetadata: {
          ipMetadataURI: mediaUrl,
          ipMetadataHash,
          nftMetadataURI: thumbnailUrl || mediaUrl,
          nftMetadataHash,
        },
        txOptions: { waitForTransaction: true },
      });

      console.log("IP Asset registered:", {
        txHash: response.txHash,
        tokenId: response.tokenId,
        ipId: response.ipId,
      });

      return {
        ipId: response.ipId,
        tokenId: response.tokenId,
        txHash: response.txHash,
        spgNftContract: newCollection.spgNftContract,
      };
    } catch (err) {
      console.error("Error registering 3D model:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register 3D model";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    register3DModel,
    isRegistering,
    error,
  };
}
