"use client";

import { useState } from "react";
import type { LicenseTerms } from "@/app/lib/story-protocol/licensing";

interface LicenseFormProps {
  onSubmit: (terms: LicenseTerms) => void;
  onCancel: () => void;
}

export function LicenseForm({ onSubmit, onCancel }: LicenseFormProps) {
  const [terms, setTerms] = useState<LicenseTerms>({
    type: "standard",
    commercial: true,
    modifications: true,
    attribution: true,
    territory: "worldwide",
    duration: 31536000, // 1 year in seconds
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(terms);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">License Type</label>
        <select
          value={terms.type}
          onChange={(e) =>
            setTerms((prev) => ({ ...prev, type: e.target.value }))
          }
          className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="standard">Standard Commercial</option>
          <option value="exclusive">Exclusive Commercial</option>
          <option value="personal">Personal Use Only</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={terms.commercial}
            onChange={(e) =>
              setTerms((prev) => ({ ...prev, commercial: e.target.checked }))
            }
            className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <span>Allow Commercial Use</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={terms.modifications}
            onChange={(e) =>
              setTerms((prev) => ({ ...prev, modifications: e.target.checked }))
            }
            className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <span>Allow Modifications</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={terms.attribution}
            onChange={(e) =>
              setTerms((prev) => ({ ...prev, attribution: e.target.checked }))
            }
            className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <span>Require Attribution</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Territory</label>
        <select
          value={terms.territory}
          onChange={(e) =>
            setTerms((prev) => ({ ...prev, territory: e.target.value }))
          }
          className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="worldwide">Worldwide</option>
          <option value="north_america">North America</option>
          <option value="europe">Europe</option>
          <option value="asia">Asia</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Duration</label>
        <select
          value={terms.duration}
          onChange={(e) =>
            setTerms((prev) => ({ ...prev, duration: Number(e.target.value) }))
          }
          className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value={31536000}>1 Year</option>
          <option value={157680000}>5 Years</option>
          <option value={315360000}>10 Years</option>
          <option value={0}>Perpetual</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Purchase License
        </button>
      </div>
    </form>
  );
}
