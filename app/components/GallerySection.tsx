export default function GallerySection() {
    return (
      <div className="px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-6">Visit the Gallery</h2>
        <div className="flex overflow-x-auto space-x-4">
          {/* Replace with actual images */}
          <img src="path/to/image3.jpg" className="w-64 rounded-lg" alt="Gallery Image" />
          <img src="path/to/image4.jpg" className="w-64 rounded-lg" alt="Gallery Image" />
          <img src="path/to/image5.jpg" className="w-64 rounded-lg" alt="Gallery Image" />
        </div>
      </div>
    );
}