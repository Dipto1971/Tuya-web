"use client";

import React, { useEffect, useState } from "react";
import { Zap, Loader2, TrendingUp } from "lucide-react";

export function Todaykwh() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [kwh, setKwh] = useState(0);

  useEffect(() => {
    const fetchTodayConsumption = async () => {
      try {
        const response = await fetch("/api/today-consumption");
        const result = await response.json();

        if (result.success) {
          setKwh(result.data.kwh);
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-xl">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Today's kWh</h3>
            <p className="text-sm text-blue-200">Energy Consumption</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-blue-300" />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {initialLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-3" />
              <span className="text-white font-medium">Loading data...</span>
            </div>
          </div>
        ) : (
          <>
            {/* kWh Display */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {kwh.toFixed(2)}
                </div>
                <div className="text-sm text-blue-200 font-medium">
                  kWh consumed today
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">
                  Device is Active
                </span>
              </div>
              <div className="text-xs text-blue-200">Real-time monitoring</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
