"use client";

import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path
      ? "text-blue-600 border-b-2 border-blue-600"
      : "text-gray-600 hover:text-blue-600";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              3D Models Marketplace
            </Link>
            <nav className="ml-10 flex space-x-8">
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
            </nav>
          </div>
          <div className="flex items-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  );
}
