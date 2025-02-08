import { IpMetadata, LicenseTerms, LicensingConfig } from '@story-protocol/core-sdk'
import { client } from './utils'
import { uploadJSONToIPFS, uploadFileToIPFS } from './scripts/uploadToIpfs'
import { createHash } from 'crypto'
import { Address, zeroAddress, toHex } from 'viem'

// Constants for Story Protocol addresses
const WIP_TOKEN = process.env.WIP_TOKEN_ADDRESS
const ROYALTY_POLICY_LAP = process.env.ROYALTY_POLICY_LAP_ADDRESS

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

function create3DModelLicenseTerms(): { terms: LicenseTerms, licensingConfig: LicensingConfig } {
  const terms: LicenseTerms = {
    transferable: true,
    royaltyPolicy: ROYALTY_POLICY_LAP,
    defaultMintingFee: BigInt(10), // 10 WIP tokens
    expiration: BigInt(0), // No expiration
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: '0x',
    commercialRevShare: 15, // 15% revenue share for original creator
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt('100000000000000000000000'), // 100,000 WIP tokens
    currency: WIP_TOKEN,
    uri: '',
  }

  const licensingConfig: LicensingConfig = {
    isSet: true,
    mintingFee: BigInt(10), // 10 WIP tokens
    licensingHook: zeroAddress,
    hookData: '0x',
    commercialRevShare: 15,
    disabled: false,
    expectMinimumGroupRewardShare: 0,
    expectGroupRewardPool: zeroAddress,
  }

  return { terms, licensingConfig }
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

  // Create license terms configuration
  const { terms, licensingConfig } = create3DModelLicenseTerms()

  // Register IP, mint NFT, and attach license terms in one transaction
  const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
    spgNftContract: process.env.SPG_NFT_CONTRACT_ADDRESS as Address,
    licenseTermsData: [{ terms, licensingConfig }],
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