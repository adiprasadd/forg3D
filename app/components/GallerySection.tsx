"use client"; // Add this directive to mark the component as a client component

import { useState } from 'react'; // Add this import

export default function GallerySection() {
    const images = [ // Add this array for images
        "gal1.png",
        "gal2.png",
        "gal3.png",
        "gal4.png",
        "gal5.png",
        "gal6.png",
        "gal7.png"
    ];
    const [currentIndex, setCurrentIndex] = useState(0); // Add state for current index
    const [fade, setFade] = useState(false); // Add state for fade effect

    const nextImage = () => { // Add function to go to the next image
        setFade(true); // Trigger fade effect
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            setFade(false); // Reset fade effect
        }, 300); // Match this duration with CSS transition duration
    };

    const prevImage = () => { // Add function to go to the previous image
        setFade(true); // Trigger fade effect
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            setFade(false); // Reset fade effect
        }, 300); // Match this duration with CSS transition duration
    };

    // Calculate the indices for the 4 images to display
    const displayedImages = [
        images[(currentIndex) % images.length],
        images[(currentIndex + 1) % images.length],
        images[(currentIndex + 2) % images.length],
        images[(currentIndex + 3) % images.length],
    ];


    const titles = [
        "Modern Interior",
        "Architecture",
        "Ocean View",
        "Urban Design",
        "VR Model",
        "Country Style Design",
        "Bright Church"
    ];

    return (
        <div className="px-8 py-16">
          <h2 className="text-3xl font-semibold text-center mb-6">Visit the Gallery</h2>
          <div className="relative max-w-7xl mx-auto">
            <div className="flex overflow-hidden gap-4">
              {displayedImages.map((src, index) => (
                <div key={index} className="flex-1 bg-white rounded-3xl p-4 shadow-lg">
                  <h3 className="text-xl font-medium mb-3 text-black">
                    {titles[(currentIndex + index) % 7]}
                  </h3>
                  <div className="relative aspect-square">
                    <img 
                      src={src} 
                      className={`w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`} 
                      alt={`Gallery Image ${index + 1}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={prevImage} 
              className="absolute -left-12 transform -translate-y-1/2 top-1/2 transition-transform duration-200 hover:scale-110"
            >
              <img src="larrow.png" alt="Previous" className="w-8 h-8" />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute -right-12 transform -translate-y-1/2 top-1/2 transition-transform duration-200 hover:scale-110"
            >
              <img src="rarrow.png" alt="Next" className="w-8 h-8" />
            </button>
          </div>
        </div>
    );
}

// "use client"; // Add this directive to mark the component as a client component

// import { useState } from 'react'; // Add this import

// export default function GallerySection() {
//     const images = [ // Add this array for images
//         "gal1.png",
//         "gal2.png",
//         "gal3.png",
//         "gal4.png",
//         "gal5.png",
//         "gal6.png",
//         "gal7.png"
//     ];
//     const [currentIndex, setCurrentIndex] = useState(0); // Add state for current index

//     const nextImage = () => { // Add function to go to the next image
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     };

//     const prevImage = () => { // Add function to go to the previous image
//         setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//     };

//     // Calculate the indices for the 4 images to display
//     const displayedImages = [
//         images[(currentIndex) % images.length],
//         images[(currentIndex + 1) % images.length],
//         images[(currentIndex + 2) % images.length],
//         images[(currentIndex + 3) % images.length],
//     ];

//     return (
//         <div className="px-6 py-16">
//           <h2 className="text-3xl font-semibold text-center mb-6">Visit the Gallery</h2>
//           <div className="relative">
//             <div className="flex overflow-hidden space-x-4">
//               {/* Display 4 images based on current index */}
//               {displayedImages.map((src, index) => (
//                 <img key={index} src={src} className="w-64 rounded-lg" alt={`Gallery Image ${index + 1}`} />
//               ))}
//             </div>
//             <button 
//               onClick={prevImage} 
//               className="absolute left-0 transform -translate-y-1/2 top-1/2 transition-transform duration-200 hover:scale-110"
//             >
//               ←
//             </button> {/* Left arrow button */}
//             <button 
//               onClick={nextImage} 
//               className="absolute right-0 transform -translate-y-1/2 top-1/2 transition-transform duration-200 hover:scale-110"
//             >
//               →
//             </button> {/* Right arrow button */}
//           </div>
//         </div>
//       );
// }
