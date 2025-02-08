// app/components/Navigation.tsx
"use client";

import Link from "next/link";
import { useStoryProtocol } from "../hooks/useStoryProtocol";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import UploadButton from "./UploadButton";

export default function Navigation() {
  const { error } = useStoryProtocol();

  return (
    <nav className="py-4 px-6 border-b border-gray-700 overflow-x-auto"> {/* Added overflow-x-auto */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-400" aria-label="Home">
          StoryForge
        </Link>
        <div className="space-x-6">
          <Link href="/models" className="hover:text-blue-400 transition" aria-label="Models">Models</Link>
          <Link href="/materials" className="hover:text-blue-400 transition" aria-label="Materials">Materials</Link>
          <Link href="/scenes" className="hover:text-blue-400 transition" aria-label="Scenes">Scenes</Link>
          <Link href="/creators" className="hover:text-blue-400 transition" aria-label="Creators">Creators</Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {error && (
        <div className="mt-2 text-red-400 text-sm text-center">
          {error} Please try again or contact support.
        </div>
      )}
    </nav>
  );
}

{/* <div className="space-x-6">
  <Link href="/marketplace" className="hover:text-blue-400 transition">
    Marketplace
  </Link>
  <Link href="/create" className="hover:text-blue-400 transition">
    Create
  </Link>
  <Link href="/dashboard" className="hover:text-blue-400 transition">
    Dashboard
  </Link>
  <button
    onClick={connectWallet}
    disabled={isConnecting || isInitialized}
    className={`px-4 py-2 rounded-lg transition ${
      isInitialized
        ? "bg-green-500 hover:bg-green-600"
        : "bg-blue-500 hover:bg-blue-600"
    }`}
  >
    {isConnecting
      ? "Connecting..."
      : isInitialized
      ? "Connected"
      : "Connect Wallet"}
  </button>
</div> */}
      