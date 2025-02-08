import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import MiddleSections from "./components/MiddleSections";
import GallerySection from "./components/GallerySection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navigation />
      <div className="bg-gray-800 px-16">
        <HeroSection />
        <MiddleSections />
        <GallerySection />
      </div>
      <Footer />
    </main>
  );
}

