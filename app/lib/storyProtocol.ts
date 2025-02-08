import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';

const config: StoryConfig = {
  accessToken: process.env.NEXT_PUBLIC_STORY_PROTOCOL_API_KEY ?? '',
  environment: 'sandbox',
  transport: {
    type: 'fetch',
    config: {
      baseUrl: 'https://testnet.storyprotocol.net/api/v1'
    }
  }
};

export const client = StoryClient.newClient(config);