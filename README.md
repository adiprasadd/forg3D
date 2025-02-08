# 3D Model Upload Platform

A platform for uploading and managing 3D models using Next.js, Supabase Storage, and Story Protocol.

## Features

- Large file uploads with chunking (up to 500MB)
- Real-time upload progress tracking
- File type validation
- Secure storage with Supabase
- Integration with Story Protocol

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- Copy `.env.example` to `.env.local`
- Fill in the required environment variables:
  - Story Protocol configuration
  - Supabase configuration

3. Set up Supabase Storage:

- Create a new Supabase project
- Create a storage bucket named '3d_files'
- Add the following storage policy:
  ```sql
  bucket_id = '3d_files'
  ```
- Configure CORS for your domain

4. Run the development server:

```bash
npm run dev
```

## Supported File Types

### 3D Models

- .obj
- .mtl
- .gltf
- .usdz
- .glb
- .fbx
- .blend

### Images & Textures

- .jpg, .jpeg, .png
- .tga, .exr, .tif, .bmp
- .hdr (lighting)

## File Size Limits

- Maximum file size: 500MB
- Chunk size: 5MB

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Environment Variables

Required environment variables:

### Story Protocol

- `NEXT_PUBLIC_RPC_PROVIDER_URL`
- `NEXT_PUBLIC_STORY_CHAIN_ID`
- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`
- `STORY_API_KEY`
- `STORY_RPC_URL`

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

See `.env.example` for all required variables and setup instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
