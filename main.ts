import { IpMetadata } from '@story-protocol/core-sdk'
import { client } from './utils'
import { uploadJSONToIPFS, uploadFileToIPFS } from './scripts/uploadToIpfs'
import { createHash } from 'crypto'
import { Address } from 'viem'

interface Model3DMetadata {
  name: string;
  description: string;
  modelFile: Buffer;
  previewImage: string;
  attributes: {
    category: string;
    format: string;
    polygonCount?: number;
    textures?: boolean;
    animations?: boolean;
  };
}

export async function register3DModel(metadata: Model3DMetadata) {
  // Upload 3D model file to IPFS
  const modelIpfsHash = await uploadFileToIPFS(metadata.modelFile);
  
  // Create IP metadata
  const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
    title: metadata.name,
    description: metadata.description,
    watermarkImg: metadata.previewImage,
    attributes: [
      {
        key: 'Category',
        value: metadata.attributes.category,
      },
      {
        key: 'Format',
        value: metadata.attributes.format,
      },
      {
        key: 'Model URL',
        value: `https://ipfs.io/ipfs/${modelIpfsHash}`,
      },
    ],
  })

  // Create NFT metadata
  const nftMetadata = {
    name: metadata.name,
    description: metadata.description,
    image: metadata.previewImage,
    attributes: metadata.attributes,
    animation_url: `https://ipfs.io/ipfs/${modelIpfsHash}`,
  }

  // Upload metadata to IPFS
  const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
  const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
  const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

  // Register IP using SPG
  const response = await client.ipAsset.mintAndRegisterIp({
    spgNftContract: process.env.SPG_NFT_CONTRACT_ADDRESS as Address,
    allowDuplicates: true,
    ipMetadata: {
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`,
    },
    txOptions: { waitForTransaction: true },
  })
  
  return {
    ipId: response.ipId,
    txHash: response.txHash,
    explorerUrl: `https://explorer.story.foundation/ipa/${response.ipId}`,
    modelUrl: `https://ipfs.io/ipfs/${modelIpfsHash}`,
  }
}