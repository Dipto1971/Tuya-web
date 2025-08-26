"use client";

import * as React from "react";
import { Area, CartesianGrid, XAxis, YAxis, ComposedChart } from "recharts";
import {
  Loader2,
  RefreshCw,
  Zap,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  power: {
    label: "Power (W)",
    color: "#ff6b6b", // Changed to bright red
  },
  current: {
    label: "Current (mA)",
    color: "#4ecdc4", // Changed to bright teal
  },
  voltage: {
    label: "Voltage (V)",
    color: "#45b7d1", // Changed to bright blue
  },
};

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("1d");
  const [chartData, setChartData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch data from API
  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        ``;
        setLoading(true);
      }

      setError(null);
      const response = await fetch("/api/today-data");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setChartData(result.data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  // Get filtered data based on time range
  const getFilteredData = () => {
    if (!chartData) return [];

    switch (timeRange) {
      case "1d":
        return chartData.today || [];
      case "7d":
        const weekData = chartData.week || [];
        console.log("Last 7 days data:", weekData);
        return weekData;
      case "30d":
        return chartData.month || [];
      default:
        return chartData.week || [];
    }
  };

  const filteredData = getFilteredData();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen p-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            style={{
              animation: "blob 7s infinite",
            }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            style={{
              animation: "blob 7s infinite",
              animationDelay: "2s",
            }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            style={{
              animation: "blob 7s infinite",
              animationDelay: "4s",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Glass Container */}
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Power Consumption Chart
                  </h1>
                  <p className="text-blue-200 text-lg">
                    Loading energy insights...
                  </p>
                </div>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="flex items-center justify-center h-96 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Analyzing Power Data
                </h3>
                <p className="text-blue-200 text-lg">
                  Connecting to energy monitoring systems...
                </p>
                <div className="flex justify-center mt-6 space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-red-500 to-orange-600 p-4 rounded-2xl">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Connection Error
                </h1>
                <p className="text-red-200 text-lg">
                  Unable to fetch power data
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center h-96 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-center max-w-lg">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Activity className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Data Fetch Failed
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
                  <p className="text-red-200 font-mono text-sm">{error}</p>
                </div>
                <button
                  onClick={() => fetchData()}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="h-5 w-5" />
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{
            animation: "blob 7s infinite",
          }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{
            animation: "blob 7s infinite",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{
            animation: "blob 7s infinite",
            animationDelay: "4s",
          }}
        ></div>
      </div>

      <div className="relative">
        <Card className="relative backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-white/10 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-7">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-2xl">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    Power Consumption Chart
                  </CardTitle>
                  <CardDescription className="text-blue-200 text-lg">
                    Real-time energy monitoring & insights
                  </CardDescription>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 h-12 bg-white/10 border-white/20 text-white backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl rounded-xl">
                    <SelectItem
                      value="1d"
                      className="text-white hover:bg-white/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                        Today
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="7d"
                      className="text-white hover:bg-white/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        Last 7 days
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="30d"
                      className="text-white hover:bg-white/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                        Last 30 days
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all group disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-6 w-6 text-white mx-auto group-hover:text-blue-300 transition-colors ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              {/* Chart Background Pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)",
                }}
              ></div>
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)",
                  backgroundSize: "50px 50px",
                }}
              ></div>

              <div className="relative p-6">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-80 w-full"
                >
                  <ComposedChart data={filteredData}>
                    <defs>
                      <linearGradient
                        id="fillPower"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-power)"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-power)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillCurrent"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-current)"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-current)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillVoltage"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-voltage)"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-voltage)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="rgba(255,255,255,0.2)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey={timeRange === "1d" ? "hour" : "date"}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      minTickGap={32}
                      tick={{
                        fill: "#ffffff", // Changed to white for better visibility
                        fontSize: 14, // Increased font size
                        fontWeight: 600, // Made bold
                      }}
                      tickFormatter={(value) => {
                        if (timeRange === "1d") {
                          return `${value}:00`;
                        } else {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }
                      }}
                      style={{
                        fill: "#DEDEDE",
                      }}
                    />
                    <YAxis
                      yAxisId="left"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      tick={{
                        fill: "#ffffff", // Changed to white for better visibility
                        fontSize: 14, // Increased font size
                        fontWeight: 600, // Made bold
                      }}
                      tickFormatter={(value) => `${value}`}
                      domain={[0, 5000]}
                      style={{
                        fill: "#EDEDED",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      tick={{
                        fill: "#ffffff", // Changed to white for better visibility
                        fontSize: 14, // Increased font size
                        fontWeight: 600, // Made bold
                      }}
                      tickFormatter={(value) => `${value}V`}
                      domain={[200, 260]}
                      style={{
                        fill: "#EDEDED",
                      }}
                    />
                    <ChartTooltip
                      cursor={{
                        strokeDasharray: "3 3",
                        stroke: "rgba(255,255,255,0.3)",
                        strokeWidth: 1,
                      }}
                      content={
                        <ChartTooltipContent
                          className=" backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl"
                          labelFormatter={(value) => {
                            if (timeRange === "1d") {
                              return `${value}:00`;
                            } else {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              );
                            }
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="power"
                      type="monotone"
                      fill="url(#fillPower)"
                      stroke="var(--color-power)"
                      strokeWidth={3}
                      yAxisId="left"
                      dot={{ fill: "var(--color-power)", strokeWidth: 0, r: 4 }}
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: "var(--color-power)",
                      }}
                    />
                    <Area
                      dataKey="current"
                      type="monotone"
                      fill="url(#fillCurrent)"
                      stroke="var(--color-current)"
                      strokeWidth={3}
                      yAxisId="left"
                      dot={{
                        fill: "var(--color-current)",
                        strokeWidth: 0,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: "var(--color-current)",
                      }}
                    />
                    <Area
                      dataKey="voltage"
                      type="monotone"
                      fill="url(#fillVoltage)"
                      stroke="var(--color-voltage)"
                      strokeWidth={3}
                      yAxisId="right"
                      dot={{
                        fill: "var(--color-voltage)",
                        strokeWidth: 0,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: "var(--color-voltage)",
                      }}
                    />
                    <ChartLegend
                      content={
                        <ChartLegendContent className="flex justify-center gap-6 pt-4 text-white font-semibold" />
                      }
                    />
                  </ComposedChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
