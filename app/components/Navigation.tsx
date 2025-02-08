import Link from "next/link";

export default function Navigation() {
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
          <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
