"use client";

import Navigation from "../components/Navigation";

export default function MarketplacePage() {
  return (
    <main>
      <Navigation />
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">3D Model Marketplace</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for model cards */}
            <div className="p-4 border border-gray-700 rounded-lg">
              <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Sample 3D Model</h3>
              <p className="text-gray-400 mb-4">Created by StoryForge Artist</p>
              <button className="w-full px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
