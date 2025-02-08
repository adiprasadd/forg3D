"use client";

import { useStoryProtocol } from "../hooks/useStoryProtocol";

export default function TestConnection() {
  const { isInitialized, error, reconnect } = useStoryProtocol();

  return (
    <div className="p-4">
      <h2>Story Protocol Status:</h2>
      <p>Initialized: {isInitialized ? "Yes" : "No"}</p>
      {error && (
        <div className="text-red-500">
          Error: {error}
          <button onClick={reconnect} className="ml-2 underline">
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
}
