"use client";

import Navigation from "../components/Navigation";
import { ModelUploader } from "../components/ModelUploader";
import { ModelList } from "../components/ModelList";
import { StatsCard } from "../components/StatsCard";

export default function DashboardPage() {
  return (
    <main>
      <Navigation />
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Creator Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <StatsCard
              title="Total Models"
              value="12"
              change="+2 this month"
              trend="up"
            />
            <StatsCard
              title="Total Revenue"
              value="5.2 ETH"
              change="+0.8 ETH this month"
              trend="up"
            />
            <StatsCard
              title="Active Licenses"
              value="28"
              change="+5 this month"
              trend="up"
            />
            <StatsCard
              title="Avg. Rating"
              value="4.8"
              change="+0.2 this month"
              trend="up"
            />
          </div>

          {/* Upload Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Upload New Model</h2>
            <ModelUploader />
          </div>

          {/* Models List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Models</h2>
            <ModelList />
          </div>
        </div>
      </div>
    </main>
  );
}
