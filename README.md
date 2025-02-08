# 3D Model Upload Platform

A robust platform for uploading, managing, and collaborating on 3D models, built with Next.js 14, Supabase Storage, and Story Protocol integration for digital asset management.

## Core Features

### Upload Capabilities
- Large file uploads with intelligent chunking (up to 500MB per file)
- Real-time upload progress tracking with detailed statistics
- Automatic file recovery and resume functionality
- Background processing for large files
- Multi-file upload support with drag-and-drop

### Storage & Processing
- Secure storage with Supabase
- Automatic file optimization and compression
- Version control system with diff tracking
- Automatic backup generation
- CDN integration for fast global access

### Model Management
- Comprehensive metadata management
- Custom properties and attributes
- Advanced search and filtering
- Tagging and categorization
- Batch operations support

### Story Protocol Integration
- Automated IP registration
- Rights management
- Licensing tracking
- Ownership verification
- Smart contract integration

## Technical Setup

1. Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

2. Configure environment variables:

```bash
# Copy environment template
cp .env.example .env.local

# Generate required keys
npm run generate-keys
```

Required variables structure:
```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000

# Story Protocol Configuration
NEXT_PUBLIC_RPC_PROVIDER_URL=
NEXT_PUBLIC_STORY_CHAIN_ID=
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=
STORY_API_KEY=
STORY_RPC_URL=

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Storage Configuration
MAX_FILE_SIZE=500000000
CHUNK_SIZE=5000000
CONCURRENT_CHUNKS=3
```

3. Set up Supabase Storage:

```sql
-- Create storage bucket
CREATE BUCKET IF NOT EXISTS "3d_files"
    WITH (
        public = false,
        file_size_limit = 500000000,
        allowed_mime_types = '{
            "model/gltf-binary",
            "model/gltf+json",
            "application/octet-stream"
        }'
    );

-- Storage policy
CREATE POLICY "Authenticated users can upload 3D files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = '3d_files' AND
        auth.role() = 'authenticated'
    );
```

4. Database Schema Setup:

```sql
-- Models table
CREATE TABLE models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    user_id UUID REFERENCES auth.users(id),
    file_path VARCHAR NOT NULL,
    file_size BIGINT NOT NULL,
    format VARCHAR NOT NULL,
    version INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Versions table
CREATE TABLE versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model_id UUID REFERENCES models(id),
    version_number INTEGER NOT NULL,
    changes TEXT,
    file_path VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);
```

## Supported Formats & Specifications

### 3D Model Formats
| Format | Extension | Max Size | Features |
|--------|-----------|----------|-----------|
| glTF Binary | .glb | 500MB | Animations, materials |
| glTF JSON | .gltf | 500MB | External textures |
| Wavefront | .obj | 500MB | Wide compatibility |
| FBX | .fbx | 500MB | Animations |
| USDZ | .usdz | 500MB | AR support |
| Blender | .blend | 500MB | Full scene data |
| Collada | .dae | 500MB | Scene hierarchy |
| STL | .stl | 500MB | 3D printing |
| 3DS | .3ds | 500MB | Legacy support |

### Texture & Material Support
| Format | Max Resolution | Color Space | Features |
|--------|----------------|-------------|-----------|
| PNG | 8192x8192 | sRGB/Linear | Transparency |
| JPEG | 8192x8192 | sRGB | High compression |
| HDR | 4096x4096 | HDR | Lighting maps |
| EXR | 4096x4096 | HDR | High dynamic range |
| TGA | 8192x8192 | sRGB | Alpha channel |
| PSD | 8192x8192 | sRGB | Layer support |

## Performance Guidelines

### Model Optimization
- Maximum polygon count: 10M triangles
- Recommended texture size: 2048x2048
- Maximum bone count: 200
- Maximum animation length: 60 seconds

### Upload Configuration
- Chunk size: 5MB
- Concurrent chunks: 3
- Auto-retry attempts: 3
- Timeout: 30 seconds per chunk

## Development Commands

```bash
# Development
npm run dev           # Start development server
npm run build        # Build production bundle
npm run start        # Start production server

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Quality Assurance
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run type-check   # Run TypeScript checks

# Documentation
npm run docs         # Generate documentation
npm run docs:serve   # Serve documentation locally

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

## API Documentation

Comprehensive API documentation is available at `/api/docs` with the following endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Model Management
- `POST /api/models/upload`
- `GET /api/models/:id`
- `PUT /api/models/:id`
- `DELETE /api/models/:id`
- `GET /api/models/:id/versions`

### Version Control
- `POST /api/models/:id/versions`
- `GET /api/models/:id/versions/:version`
- `POST /api/models/:id/revert/:version`

## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```
3. Follow our coding standards:
   - Use TypeScript for all new code
   - Maintain 90% test coverage
   - Follow ESLint and Prettier configurations
   - Add JSDoc comments for public APIs
4. Commit using conventional commits:
```bash
git commit -m 'feat: add amazing feature'
```
5. Push and open a Pull Request

## Support & Community

- Documentation: [https://docs.example.com](https://docs.example.com)
- Discord: [Join our community](https://discord.gg/example)
- GitHub Issues: Bug reports and feature requests
- Email: support@example.com

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) - 3D rendering engine
- [Story Protocol](https://storyprotocol.xyz) - IP management
- [Supabase](https://supabase.com) - Backend infrastructure
- [Next.js](https://nextjs.org) - React framework
- All our amazing contributors

---
Built with ❤️ by the 3D Model Upload Platform Team
