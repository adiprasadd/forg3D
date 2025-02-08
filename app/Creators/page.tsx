"use client";

import UploadButton from "../components/UploadButton";
import ProductDashboard from "../components/ProductDashboard";

export default function CreatorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-center">Creator Dashboard</h1>
        <p className="text-gray-400 mb-8 text-center">
          Upload and manage your 3D models
        </p>
        
        {/* Product Dashboard */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Your Products</h2>
          <ProductDashboard />
        </div>
        
        {/* Upload Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Upload New Product</h2>
          <UploadButton
            onUploadComplete={(result) => {
              console.log('Upload completed:', result);
              // You could refresh the ProductDashboard here
              window.location.reload();
            }}
          />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import UploadButton from "../components/UploadButton";

// export default function CreatorPage() {
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <div className="mb-12">
//         <h1 className="text-4xl font-bold mb-4 text-center">Creator Dashboard</h1>
//         <p className="text-gray-400 mb-8 text-center">
//           Upload and manage your 3D models
//         </p>
//         <UploadButton
//           onUploadComplete={(result) => {
//             // Just handle the result without navigation
//             console.log('Upload completed:', result);
//             // You could show a success message or update the UI here
//           }}
//         />
//       </div>
//     </div>
//   );
// }