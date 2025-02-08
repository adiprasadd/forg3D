"use client";

import Navigation from "../components/Navigation";

export default function CreatePage() {
  return (
    <main>
      <Navigation />
      <div className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Create New Model</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Model Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter model name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Describe your model"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Model
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400">
                  Drag and drop your model file here, or click to browse
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              Create Model
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
