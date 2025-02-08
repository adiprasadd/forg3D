export default function HeroSection() {
    return (
      <div className="flex items-center px-6 py-8" style={{ height: '80vh' }}>
        <div className="flex-1 mx-auto">
          <video className="w-full h-full rounded-lg" controls>
            <source src="/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex-1 text-center mx-auto" >
          <h1 className="text-5xl font-bold mb-6">Welcome to Our Platform</h1>
          <p className="text-xl text-gray-700">Transform your ideas into reality.</p>
        </div>
      </div>
    );
}
// export default function HeroSection() {
//     return (
//       <div className="flex px-6 py-16" style={{ height: '80vh' }}>
//         <div className="flex-1 mx-auto" style={{ margin: '0 2.5%', width: '45%' }}>
//           <video className="w-full h-full rounded-lg" controls>
//             <source src="/hero.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//         <div className="flex-1 text-center mx-auto" style={{ margin: '0 2.5%', width: '45%' }}>
//           <h1 className="text-5xl font-bold mb-6">Welcome to Our Platform</h1>
//           <p className="text-xl text-gray-700">Transform your ideas into reality.</p>
//         </div>
//       </div>
//     );
// }
