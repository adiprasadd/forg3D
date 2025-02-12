"use client";

import { useState } from "react";
import { LicenseTier, LICENSE_CONFIGS } from "../hooks/useLicenseManagement";

interface LicenseTierSelectorProps {
  onSelect: (tier: LicenseTier) => void;
  selectedTier?: LicenseTier;
  disabled?: boolean;
}

export default function LicenseTierSelector({
  onSelect,
  selectedTier,
  disabled = false,
}: LicenseTierSelectorProps) {
  const [expandedTier, setExpandedTier] = useState<LicenseTier | null>(null);

  const formatPrice = (wei: string) => {
    const tokens = Number(BigInt(wei)) / 1e18;
    return `${tokens} WIP`;
  };

  const formatRevShare = (basisPoints: number) => {
    return `${basisPoints / 100}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Object.entries(LICENSE_CONFIGS).map(([tier, config]) => (
        <div
          key={tier}
          className={`border rounded-lg p-4 ${
            selectedTier === tier
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => !disabled && onSelect(tier as LicenseTier)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{config.name}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {formatPrice(config.mintingFee)}
              </div>
              {config.revShare > 0 && (
                <div className="text-sm text-gray-500">
                  +{formatRevShare(config.revShare)} revenue share
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </div>
            ))}
          </div>

          <button
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedTier(
                expandedTier === (tier as LicenseTier)
                  ? null
                  : (tier as LicenseTier)
              );
            }}
          >
            {expandedTier === tier ? "Show less" : "Show details"}
          </button>

          {expandedTier === tier && (
            <div className="mt-4 text-sm border-t pt-4">
              <h4 className="font-semibold mb-2">Usage Limits</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  Copies:{" "}
                  {config.usageLimits.copies === 999999
                    ? "Unlimited"
                    : config.usageLimits.copies}
                </li>
                <li>
                  Projects:{" "}
                  {config.usageLimits.projects === 999999
                    ? "Unlimited"
                    : config.usageLimits.projects}
                </li>
                <li>
                  Duration:{" "}
                  {config.usageLimits.timeLimit === 0
                    ? "Perpetual"
                    : `${config.usageLimits.timeLimit / 86400} days`}
                </li>
              </ul>

              <h4 className="font-semibold mt-4 mb-2">Commercial Rights</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  Modifications:{" "}
                  {config.commercialRights.modification ? "✓" : "✗"}
                </li>
                <li>
                  Resale Rights: {config.commercialRights.resale ? "✓" : "✗"}
                </li>
                <li>
                  Sublicensing: {config.commercialRights.sublicense ? "✓" : "✗"}
                </li>
              </ul>

              {config.maxRevenue !== "0" && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Revenue Ceiling</h4>
                  <p className="text-gray-600">
                    {formatPrice(config.maxRevenue)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
