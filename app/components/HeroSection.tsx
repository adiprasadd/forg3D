export default function HeroSection() {
  return (
    <div className="max-w-6xl mx-auto py-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          3D Model Marketplace
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The first decentralized marketplace for high-fidelity 3D models.
          Powered by Story Protocol for secure IP licensing and royalty
          distribution.
        </p>
        <div className="flex gap-6 justify-center">
          <button className="px-8 py-4 bg-blue-500 rounded-lg hover:bg-blue-600 transition font-semibold">
            Browse Models
          </button>
          <button className="px-8 py-4 border-2 border-blue-500 rounded-lg hover:bg-blue-500/10 transition font-semibold">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
}
