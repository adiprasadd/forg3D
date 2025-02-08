import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import MiddleSections from "./components/MiddleSections";
import GallerySection from "./components/GallerySection";
import Footer from "./components/Footer";

export const metadata = {
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '32x32' },
      { url: '/logo.png', sizes: '16x16' },
    ],
  },
};

export default function Home() {
  return (
    <main>
      <div className="bg-gray-800 px-16">
        <HeroSection />
        <MiddleSections />
        <GallerySection />
      </div>
    </main>
  );
}
   
