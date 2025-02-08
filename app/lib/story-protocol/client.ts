import { StoryClient } from "@story-protocol/core-sdk";
import { getStoryConfig } from "./config";
import { getWalletAccount } from "./wallet";
import {
  createCommercialRemixTerms,
  defaultLicensingConfig,
} from "./licensing";
import type { IPAssetMetadata, CommercialTerms } from "./types";

export class StoryProtocolService {
  private static instance: StoryProtocolService;
  private client: StoryClient | null = null;

  private constructor() {}

  public static getInstance(): StoryProtocolService {
    if (!StoryProtocolService.instance) {
      StoryProtocolService.instance = new StoryProtocolService();
    }
    return StoryProtocolService.instance;
  }

  public async initializeClient(privateKey?: string) {
    const account = getWalletAccount(privateKey);
    if (!account) {
      throw new Error("Failed to initialize wallet account");
    }

    const config = getStoryConfig(account);
    this.client = StoryClient.newClient(config);
    return this.client;
  }

  public getClient(): StoryClient | null {
    return this.client;
  }

  public async registerIPAsset(
    metadata: IPAssetMetadata,
    terms: CommercialTerms
  ) {
    if (!this.client) throw new Error("Client not initialized");

    try {
      // Create license terms for the IP asset
      const licenseTerms = createCommercialRemixTerms(terms);

      // Register the IP asset with Story Protocol
      const response = await this.client.ipAsset.register({
        name: metadata.name,
        description: metadata.description,
        mediaUrl: metadata.mediaUrl,
        licenseTerms,
        licensingConfig: defaultLicensingConfig,
      });

      return response;
    } catch (error) {
      console.error("Error registering IP asset:", error);
      throw error;
    }
  }

  public async getLicenseTerms(ipAssetId: string) {
    if (!this.client) throw new Error("Client not initialized");

    try {
      const terms = await this.client.ipAsset.getLicenseTerms(ipAssetId);
      return terms;
    } catch (error) {
      console.error("Error getting license terms:", error);
      throw error;
    }
  }
}

export const storyProtocol = StoryProtocolService.getInstance();
