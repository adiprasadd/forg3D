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

    return (
        <div className="px-6 py-16">
          <h2 className="text-3xl font-semibold text-center mb-6">Visit the Gallery</h2>
          <div className="relative">
            <div className="flex overflow-hidden space-x-4">
              {/* Display 4 images based on current index */}
              {displayedImages.map((src, index) => (
                <img 
                  key={index} 
                  src={src} 
                  className={`w-64 rounded-lg transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`} 
                  alt={`Gallery Image ${index + 1}`} 
                />
              ))}
            </div>
            <button 
              onClick={prevImage} 
              className="absolute left-0 transform -translate-y-1/2 top-1/2 transition-transform duration-200 hover:scale-110"
            >
              ←
            </button> {/* Left arrow button */}
            <button 
              onClick={nextImage} 
              className="absolute right-0 transform -translate-y-1/2 top-1/2 transition-transform duration-200 hover:scale-110"
            >
              →
            </button> {/* Right arrow button */}
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
