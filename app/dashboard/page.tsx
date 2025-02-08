"use client";

import Navigation from "../components/Navigation";

export default function DashboardPage() {
  return (
    <main>
      <Navigation />
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Creator Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Your Models</h2>
              <div className="space-y-4">
                {/* Placeholder for model list */}
                <div className="p-4 border border-gray-700 rounded-lg">
                  <h3 className="font-medium">Sample Model</h3>
                  <p className="text-sm text-gray-400">Created 2 days ago</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold">0.00 ETH</p>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">Models Sold</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
