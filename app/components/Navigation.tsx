"use client";

import Link from "next/link";
import { useStoryProtocol } from "../hooks/useStoryProtocol";

export default function Navigation() {
  const { isConnecting, error, connectWallet, isInitialized } =
    useStoryProtocol();

  return (
    <nav className="py-4 px-6 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          StoryForge
        </Link>
        <div className="space-x-6">
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
        </div>
      </div>
      {error && (
        <div className="mt-2 text-red-400 text-sm text-center">{error}</div>
      )}
    </nav>
  );
}
