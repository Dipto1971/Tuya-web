"use client";

import * as React from "react";
import { Activity, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A step area chart";

const chartConfig = {
  unit: {
    label: "Unit (kWh)",
    color: "#4ecdc4",
    icon: Activity,
  },
};

export function UnitkwhChart() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch kWh data from API
  const fetchKwhData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch("/api/today-data");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Process the data from our API structure
        const dataPoints = result.data;

        // Calculate daily kWh based on power consumption
        const dailyKwhData = dataPoints.map((item, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (dataPoints.length - 1 - index));
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          // Extract power value from the data structure
          const powerItem = item.data?.find((d) => d.code === "cur_power");
          const power = powerItem ? powerItem.value : 0;
          const dailyKwh = (power / 1000) * 8; // Convert to kWh (assuming 8 hours usage)

          return {
            day: dayName,
            unit: parseFloat(dailyKwh.toFixed(2)), // Round to 2 decimal places
          };
        });

        setChartData(dailyKwhData);
      } else {
        throw new Error("Failed to fetch kWh data");
      }
    } catch (err) {
      console.error("Error fetching kWh data:", err);
      setError(err.message);

      // Fallback to sample data on error
      setChartData([
        { day: "Mon", unit: 8.8 },
        { day: "Tue", unit: 9.6 },
        { day: "Wed", unit: 12.0 },
        { day: "Thu", unit: 12.8 },
        { day: "Fri", unit: 13.6 },
        { day: "Sat", unit: 14.4 },
        { day: "Sun", unit: 15.2 },
      ]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    fetchKwhData();
  }, []);

  const handleRefresh = () => {
    fetchKwhData();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 w-[600px] h-[430px] flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Weekly Unit kWh Chart
            </h3>
            <p className="text-sm text-blue-200">Loading energy data...</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="text-white font-medium">
              Loading chart data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 w-[600px] h-[430px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Weekly Unit kWh Chart
              </h3>
              <p className="text-sm text-red-200">Failed to load data</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="text-center space-y-4">
            <p className="text-sm text-red-200">{error}</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 w-[600px] h-[430px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Weekly Unit kWh Chart
            </h3>
            <p className="text-sm text-blue-200">
              Daily energy consumption for the last 7 days
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillUnit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => value.slice(0, 3)}
              style={{
                fill: "#EDEDED",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl text-white"
                  hideLabel
                />
              }
            />
            <Area
              dataKey="unit"
              type="step"
              fill="url(#fillUnit)"
              fillOpacity={0.4}
              stroke="#4ecdc4"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
