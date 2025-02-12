"use client";

import { useState } from "react";
import { useStoryProtocol } from "./useStoryProtocol";
import { useWallet } from "../components/WalletProvider";
import { Address, toHex } from "viem";

interface StoryMintParams {
  name: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  price?: string;
  royaltyPercentage?: number;
}

interface MintResult {
  ipId: string;
  tokenId: bigint;
  txHash: string;
  spgNftContract: string;
}

export function useStoryMint() {
  const { client, isInitialized } = useStoryProtocol();
  const { address } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintModelToken = async ({
    name,
    description,
    mediaUrl,
    thumbnailUrl,
    price = "0",
    royaltyPercentage = 10,
  }: StoryMintParams): Promise<MintResult> => {
    if (!client || !isInitialized) {
      throw new Error("Story Protocol client not initialized");
    }

    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsMinting(true);
      setError(null);

      // First create a new NFT collection for the model
      console.log("Creating NFT collection...");
      const collection = await client.nftClient.createNFTCollection({
        name: `${name} Collection`,
        symbol: "3DM",
        isPublicMinting: true,
        mintOpen: true,
        mintFeeRecipient: address as Address,
        contractURI: "",
        txOptions: { waitForTransaction: true },
      });

      console.log("Collection created:", collection.spgNftContract);

      // Prepare metadata
      const ipMetadata = {
        title: name,
        description,
        modelUrl: mediaUrl,
        previewUrl: thumbnailUrl,
        attributes: [
          { key: "Category", value: "3D Model" },
          { key: "Price", value: price },
          { key: "RoyaltyPercentage", value: royaltyPercentage.toString() },
          { key: "Creator", value: address },
        ],
      };

      const nftMetadata = {
        name,
        description,
        image: thumbnailUrl || mediaUrl,
        attributes: {
          category: "3D Model",
          price,
          royaltyPercentage,
          creator: address,
        },
      };

      // Create metadata hashes
      const ipMetadataHash = toHex(JSON.stringify(ipMetadata), { size: 32 });
      const nftMetadataHash = toHex(JSON.stringify(nftMetadata), { size: 32 });

      // Mint and register the IP asset
      console.log("Minting and registering IP asset...");
      const response = await client.ipAsset.mintAndRegisterIp({
        spgNftContract: collection.spgNftContract as Address,
        allowDuplicates: true,
        ipMetadata: {
          ipMetadataURI: mediaUrl,
          ipMetadataHash,
          nftMetadataURI: thumbnailUrl || mediaUrl,
          nftMetadataHash,
        },
        txOptions: { waitForTransaction: true },
      });

      console.log("Minting successful:", {
        ipId: response.ipId,
        tokenId: response.tokenId,
        txHash: response.txHash,
      });

      // Save the model data to your backend
      await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ipId: response.ipId,
          tokenId: response.tokenId?.toString(),
          name,
          description,
          mediaUrl,
          thumbnailUrl,
          price,
          royaltyPercentage,
          creator: address,
          spgNftContract: collection.spgNftContract,
        }),
      });

      return {
        ipId: response.ipId,
        tokenId: response.tokenId || BigInt(0),
        txHash: response.txHash,
        spgNftContract: collection.spgNftContract,
      };
    } catch (err) {
      console.error("Error minting model token:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mint token";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsMinting(false);
    }
  };

  return {
    mintModelToken,
    isMinting,
    error,
  };
}
