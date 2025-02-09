import fs from "fs";
import path from "path";
import ModelViewer from "../../components/ModelViewer";
import ProductDetails from "../../components/ProductDetails";

async function getModelDetails(id: string) {
  const modelDir = path.join(process.cwd(), "public", "uploads", id);
  const metadataPath = path.join(modelDir, "metadata.json");

  console.log("\n📂 Reading model metadata...");
  console.log("Model directory:", modelDir);
  console.log("Metadata path:", metadataPath);

  try {
    // Check if directory exists
    if (!fs.existsSync(modelDir)) {
      console.error(`Model directory not found: ${modelDir}`);
      return null;
    }

    // Check if metadata file exists
    if (!fs.existsSync(metadataPath)) {
      console.error(`Metadata file not found: ${metadataPath}`);
      return null;
    }

    const rawMetadata = fs.readFileSync(metadataPath, "utf-8");
    console.log("\nRaw metadata content:", rawMetadata);

    const metadata = JSON.parse(rawMetadata);
    console.log("\nParsed metadata:", metadata);

    if (!metadata.ipId) {
      console.warn(`⚠️ No ipId found in metadata for model ${id}`);
    } else {
      console.log("✅ Found IP Asset ID:", metadata.ipId);
    }

    const modelDetails = {
      id,
      name: metadata.name,
      description: metadata.description,
      price: metadata.price,
      ipId: metadata.ipId || "Not available", // Provide fallback
      upfrontPrice: metadata.price,
      revenueSharePrice: metadata.price / 2,
      revenueSharePercentage: metadata.royaltyPercentage || 10,
      thumbnailUrl: `/uploads/${id}/cover.png`,
      modelUrl: `/uploads/${id}/model.gltf`,
    };

    console.log("\nReturning model details:", modelDetails);
    return modelDetails;
  } catch (error) {
    console.error(`Error reading metadata for ${id}:`, error);
    return null;
  }
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Await the params.id before using it
  const { id } = await Promise.resolve(params);
  const model = await getModelDetails(id);

  if (!model) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500">Product not found</h1>
        <p className="text-gray-400 mt-2">
          The requested model could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3D Model Viewer */}
        <div className="bg-gray-900 rounded-xl h-[500px]">
          <ModelViewer
            modelUrl={model.modelUrl}
            exposure={1.5}
            cameraControls={true}
            autoRotate={true}
            shadowIntensity={0.7}
          />
        </div>

        {/* Product Information */}
        <ProductDetails
          name={model.name}
          description={model.description}
          ipId={model.ipId}
          upfrontPrice={model.upfrontPrice}
          revenueSharePrice={model.revenueSharePrice}
          revenueSharePercentage={model.revenueSharePercentage}
        />
      </div>
    </div>
  );
}
// import fs from 'fs';
// import path from 'path';
// import ModelViewer from '../../components/ModelViewer';

// async function getModelDetails(id: string) {
//     const modelDir = path.join(process.cwd(), 'public', 'uploads', id);
//     const metadataPath = path.join(modelDir, 'metadata.json');

//     try {
//       const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
//       return {
//         id,
//         name: metadata.name,
//         description: metadata.description,
//         price: metadata.price,
//         thumbnailUrl: `/uploads/${id}/cover.png`,
//         modelUrl: `/uploads/${id}/model.gltf`,  // Updated to use GLTF
//       };
//     } catch (error) {
//       console.error(`Error reading metadata for ${id}:`, error);
//       return null;
//     }
//   }

//   export default async function ProductPage({ params }: { params: { id: string } }) {
//     const model = await getModelDetails(params.id);

//     if (!model) {
//       return <div>Product not found</div>;
//     }

//     return (
//       <div className="container mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* 3D Model Viewer */}
//           <div className="bg-gray-900 rounded-xl h-[500px]">
//             <ModelViewer modelUrl={model.modelUrl} />
//           </div>

//           {/* ... rest of the existing code ... */}
//         </div>
//       </div>
//     );
//   }
