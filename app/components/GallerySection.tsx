export default function GallerySection() {
  const models = [
    {
      id: 1,
      name: "Sci-fi Character",
      creator: "Studio Alpha",
      price: "0.5 ETH",
    },
    {
      id: 2,
      name: "Fantasy Weapon",
      creator: "Digital Arts",
      price: "0.3 ETH",
    },
    { id: 3, name: "Modern Interior", creator: "3D Masters", price: "0.8 ETH" },
    // Add more models
  ];

  return (
    <div className="max-w-6xl mx-auto py-20">
      <h2 className="text-4xl font-bold mb-12 text-center">Featured Models</h2>
      <div className="grid grid-cols-3 gap-8">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-gray-900 rounded-xl overflow-hidden"
          >
            <div className="h-48 bg-gray-800">
              {/* Model preview will go here */}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{model.name}</h3>
              <p className="text-gray-300 mb-4">By {model.creator}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">{model.price}</span>
                <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
