import fs from 'fs';
import path from 'path';

// Helper function to read metadata from uploads directory
async function getUploadedModels() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Read all directories in uploads folder
  const modelDirs = fs.readdirSync(uploadsDir).filter(file => 
    fs.statSync(path.join(uploadsDir, file)).isDirectory()
  );

  // Read metadata for each model
  const models = await Promise.all(modelDirs.map(async (dirName) => {
    const modelDir = path.join(uploadsDir, dirName);
    const metadataPath = path.join(modelDir, 'metadata.json');
    
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      return {
        id: dirName,
        name: metadata.name,
        description: metadata.description,
        price: `$${metadata.price.toFixed(2)}`,
        thumbnailUrl: `/uploads/${dirName}/cover.png`,
        status: "active" // You can modify this based on your needs
      };
    } catch (error) {
      console.error(`Error reading metadata for ${dirName}:`, error);
      return null;
    }
  }));

  // Filter out any null values from failed reads
  return models.filter(model => model !== null);
}

export default async function MarketplacePage() {
  const models = await getUploadedModels();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-gray-900 rounded-xl overflow-hidden group">
            <div className="relative h-48 bg-gray-800">
              <img
                src={model.thumbnailUrl}
                alt={model.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <a href={`/marketplace/${model.id}`} className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                  View Details
                </a>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold truncate">{model.name}</h3>
                <span className="text-sm px-2 py-1 rounded bg-green-500/20 text-green-400">
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {model.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">{model.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}