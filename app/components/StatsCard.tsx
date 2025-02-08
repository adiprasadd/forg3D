interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export function StatsCard({ title, value, change, trend }: StatsCardProps) {
  return (
    <div className="p-6 bg-gray-900 rounded-xl">
      <h3 className="text-gray-400 font-medium mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold">{value}</p>
        <div
          className={`flex items-center ${
            trend === "up" ? "text-green-400" : "text-red-400"
          }`}
        >
          <span className="text-sm font-medium">{change}</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {trend === "up" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
