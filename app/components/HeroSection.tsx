export default function HeroSection() {
    return (
      <div className="flex px-6 py-16">
        <div className="flex-1">
          <video className="w-full rounded-lg" controls>
            <source src="hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-5xl font-bold mb-6">Dream in 3D.</h1>
          <p className="text-xl px-16">BlenderKit community provides you everything needed to create beautiful 3D artworks.
          Download models, materials, HDRs, scenes and brushes directly in Blender.
        Support our creators by buying Full Plan or enjoy BlenderKit for free.</p>
        </div>
      </div>
    );
  }