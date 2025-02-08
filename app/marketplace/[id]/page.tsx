import fs from 'fs';
import path from 'path';
import ModelViewer from '../../components/ModelViewer';
import ProductDetails from '../../components/ProductDetails';


async function getModelDetails(id: string) {
    const modelDir = path.join(process.cwd(), 'public', 'uploads', id);
    const metadataPath = path.join(modelDir, 'metadata.json');
    
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      return {
        id,
        name: metadata.name,
        description: metadata.description,
        price: metadata.price,
        thumbnailUrl: `/uploads/${id}/cover.png`,
        modelUrl: `/uploads/${id}/model.gltf`,  // Updated to use GLTF
      };
    } catch (error) {
      console.error(`Error reading metadata for ${id}:`, error);
      return null;
    }
  }
  
  export default async function ProductPage({ params }: { params: { id: string } }) {
    const model = await getModelDetails(params.id);
  
    if (!model) {
      return <div>Product not found</div>;
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
            price={model.price}
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