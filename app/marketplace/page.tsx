export default function MarketplacePage() {
  const models = [
    {
      id: 1,
      name: "Model 1",
      description: "Description for Model 1",
      price: "$10.00",
      thumbnailUrl: "https://via.placeholder.com/150",
      status: "active",
    },
    {
      id: 2,
      name: "Model 2",
      description: "Description for Model 2",
      price: "$15.00",
      thumbnailUrl: "https://via.placeholder.com/150",
      status: "pending",
    },
    {
      id: 3,
      name: "Model 3",
      description: "Description for Model 3",
      price: "$20.00",
      thumbnailUrl: "https://via.placeholder.com/150",
      status: "sold",
    },
    // Add more models as needed
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-gray-900 rounded-xl overflow-hidden group">
            <div className="relative h-48 bg-gray-800">
              {model.thumbnailUrl && (
                <img
                  src={model.thumbnailUrl}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold truncate">{model.name}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    model.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : model.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
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
