import { createHash } from 'crypto';
import { toHex } from 'viem';

export interface ModelMetadata {
    name: string;
    description: string;
    modelUrl: string;
    thumbnailUrl: string;
    creator: string;
    license: string;
    properties: {
        format: string;
        polyCount: number;
        textured: boolean;
        rigged: boolean;
        [key: string]: any;
    };
}

export function generateMetadataHash(metadata: any): string {
    const hash = createHash('sha256')
        .update(JSON.stringify(metadata))
        .digest('hex');
    return toHex(hash, { size: 32 });
}

export function createModelMetadata(
    name: string,
    description: string,
    modelUrl: string,
    creator: string,
    properties: Partial<ModelMetadata['properties']> = {}
): ModelMetadata {
    return {
        name,
        description,
        modelUrl,
        thumbnailUrl: `${modelUrl}/thumbnail.png`,
        creator,
        license: 'Story Protocol License',
        properties: {
            format: 'glb',
            polyCount: 0,
            textured: true,
            rigged: false,
            ...properties
        }
    };
}

export function generateIPMetadata(metadata: ModelMetadata) {
    const ipMetadataURI = `ipfs://${uploadToIPFS(metadata)}`; // You'll need to implement IPFS upload
    const nftMetadataURI = `${ipMetadataURI}/nft`;
    
    return {
        ipMetadataURI,
        ipMetadataHash: generateMetadataHash(metadata),
        nftMetadataURI,
        nftMetadataHash: generateMetadataHash({ ...metadata, type: 'nft' })
    };
}

// Placeholder for IPFS upload function
function uploadToIPFS(data: any): string {
    // Implement IPFS upload logic here
    console.log('TODO: Implement IPFS upload');
    return 'placeholder-ipfs-hash';
}
