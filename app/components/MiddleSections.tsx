export default function MiddleSections() {
  return (
    <div className="max-w-6xl mx-auto py-20 space-y-16">
      <div className="flex items-center">
        <img src="/middle1.png" alt="For Creators" className="w-1/2 rounded-lg" />
        <div className="w-1/2 p-8">
          <h3 className="text-2xl font-bold mb-4">For Creators</h3>
          <p className="text-gray-300">
            License your 3D models and earn royalties automatically. Get paid
            for every use of your work.
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-1/2 p-8">
          <h3 className="text-2xl font-bold mb-4">For Studios</h3>
          <p className="text-gray-300">
            Access high-quality 3D models instantly with clear licensing terms
            and usage rights.
          </p>
        </div>
        <img src="/middle2.png" alt="For Studios" className="w-1/2 rounded-lg" />
      </div>
    </div>
  );
}