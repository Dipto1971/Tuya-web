"use client";

import React, { useEffect, useState } from "react";
import { Banknote, Loader2, DollarSign } from "lucide-react";

// Tariff slabs (step-wise rates)
const tariffSlabs = [
  { limit: 75, rate: 4.5 },
  { limit: 125, rate: 5.5 },
  { limit: 100, rate: 6.5 },
  { limit: 100, rate: 8.5 },
  { limit: Infinity, rate: 11.0 },
];

// Calculate cost based on slabs
function calculateTariffCost(units) {
  let cost = 0;
  let remaining = units;

  for (let i = 0; i < tariffSlabs.length; i++) {
    if (remaining <= 0) break;

    const slab = tariffSlabs[i];
    const slabUnits = Math.min(remaining, slab.limit);
    cost += slabUnits * slab.rate;
    remaining -= slabUnits;
  }

  return cost;
}

export function TodayCost() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [kwh, setKwh] = useState(0);
  const [tariffCost, setTariffCost] = useState(0);

  useEffect(() => {
    const fetchTodayConsumption = async () => {
      try {
        const response = await fetch("/api/today-consumption");

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text(); // fallback to reading as text
          console.error("Non-JSON response received:", text);
          return;
        }

        const result = await response.json();

        if (result.success) {
          const units = result.data.kwh;
          const cost = calculateTariffCost(units);

          setKwh(units);
          setTariffCost(cost);
        } else {
          console.error("Failed to fetch:", result.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTodayConsumption();
  }, []);

  return (
    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-xl">
              <Banknote className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Today's Cost</h3>
            <p className="text-sm text-blue-200">Electricity Bill</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-yellow-300" />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {initialLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto mb-3" />
              <span className="text-white font-medium">
                Calculating cost...
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Cost Display */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  ৳{tariffCost.toFixed(2)}
                </div>
                <div className="text-sm text-yellow-200 font-medium">
                  Total cost today
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white font-medium">
                  Units Consumed
                </span>
                <span className="text-sm text-blue-200 font-bold">
                  {kwh.toFixed(2)} kWh
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">
                  Rate Type
                </span>
                <span className="text-xs text-blue-200">Step-wise tariff</span>
              </div>
            </div>

            {/* Tariff Info */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-3 border border-orange-400/20">
              <div className="text-xs text-orange-200 text-center">
                Based on Bangladeshi official tariff slabs
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
