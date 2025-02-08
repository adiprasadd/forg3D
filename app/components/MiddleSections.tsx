export default function MiddleSections() {
  return (
    <div className="max-w-6xl mx-auto py-20">
      <div className="grid grid-cols-3 gap-8">
        <div className="p-8 bg-gray-900 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">For Creators</h3>
          <p className="text-gray-300">
            License your 3D models and earn royalties automatically. Get paid
            for every use of your work.
          </p>
        </div>
        <div className="p-8 bg-gray-900 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">For Studios</h3>
          <p className="text-gray-300">
            Access high-quality 3D models instantly with clear licensing terms
            and usage rights.
          </p>
        </div>
        <div className="p-8 bg-gray-900 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">AI Integration</h3>
          <p className="text-gray-300">
            Generate base models from text and refine them with professional
            tools.
          </p>
        </div>
      </div>
    </div>
  );
}
