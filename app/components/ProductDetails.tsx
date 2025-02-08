'use client';

interface ProductDetailsProps {
  name: string;
  description: string;
  price: number;
}

export default function ProductDetails({ name, description, price }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="text-gray-600">{description}</p>
      
      <div className="border-t border-b py-4 my-6">
        <div className="text-2xl font-bold text-green-600">
          ${price.toFixed(2)}
        </div>
      </div>

      <button 
        onClick={() => {
          // You can implement your payment logic here
          alert('Payment integration coming soon!');
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
      >
        Buy Now
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>High-quality 3D model</li>
          <li>Instant download after purchase</li>
          <li>Format: GLTF</li>
        </ul>
      </div>
    </div>
  );
}