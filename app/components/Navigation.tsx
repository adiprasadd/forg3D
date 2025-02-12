"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectWallet";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path
      ? "text-blue-500 border-b-2 border-blue-500"
      : "text-gray-300 hover:text-blue-400";
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-blue-400"
            >
              StoryForge
            </Link>
            <div className="ml-10 flex space-x-8">
              <Link
                href="/models"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/models"
                )}`}
              >
                Models
              </Link>
              <Link
                href="/my-models"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/my-models"
                )}`}
              >
                My Models
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}

// // app/components/Navigation.tsx
// "use client";

// import Link from "next/link";
// import { useStoryProtocol } from "../hooks/useStoryProtocol";
// import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// import UploadButton from "./UploadButton";

// export default function Navigation() {
//   const { error } = useStoryProtocol();

//   return (
//     <nav className="py-4 px-6 border-b border-gray-700 overflow-x-auto"> {/* Added overflow-x-auto */}
//       <div className="flex items-center justify-between">
//         <Link
//           href="/"
//           className="text-2xl font-bold text-blue-400"
//           aria-label="Home"
//         >
//           StoryForge
//         </Link>
//         <div className="flex items-center space-x-6">
//           <Link href="/marketplace" className="hover:text-blue-400 transition">
//             Marketplace
//           </Link>
//           <Link href="/creators" className="hover:text-blue-400 transition">
//             Creators
//           </Link>
//           <UploadButton
//             onUploadComplete={(result) => {
//               console.log("Upload complete:", result);
//               // Redirect to create page with the uploaded file info
//               window.location.href = `/create?fileUrl=${encodeURIComponent(
//                 result.url
//               )}&fileId=${result.publicId}`;
//             }}
//             label="Upload Model"
//           />
//           <SignedOut>
//             <SignInButton mode="modal">
//               <button className="hover:text-blue-400 transition">
//                 Sign In
//               </button>
//             </SignInButton>
//           </SignedOut>
//           <SignedIn>
//             <UserButton/>
//           </SignedIn>
//         </div>
//       </div>
//       {error && (
//         <div className="mt-2 text-red-400 text-sm text-center">{error}</div>
//       )}
//     </nav>
//   );
// }

// {
//   /* <div className="space-x-6">
//   <Link href="/marketplace" className="hover:text-blue-400 transition">
//     Marketplace
//   </Link>
//   <Link href="/create" className="hover:text-blue-400 transition">
//     Create
//   </Link>
//   <Link href="/dashboard" className="hover:text-blue-400 transition">
//     Dashboard
//   </Link>
//   <button
//     onClick={connectWallet}
//     disabled={isConnecting || isInitialized}
//     className={`px-4 py-2 rounded-lg transition ${
//       isInitialized
//         ? "bg-green-500 hover:bg-green-600"
//         : "bg-blue-500 hover:bg-blue-600"
//     }`}
//   >
//     {isConnecting
//       ? "Connecting..."
//       : isInitialized
//       ? "Connected"
//       : "Connect Wallet"}
//   </button>
// </div> */
// }
