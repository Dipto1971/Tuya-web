"use client";

import { TodayCost } from "@/components/TodayCost";
import { ChartAreaInteractive } from "./Main_chart";
import { DeviceControl } from "@/components/DeviceControl";
import { UnitkwhChart } from "@/components/UnitkwhChart";
import { UnitMoneyChart } from "@/components/UnitMoneyChart";
import React, { useEffect, useState } from "react";
import { Todaykwh } from "@/components/Todaykwh";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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

      <div className="container mx-auto p-6 space-y-6 relative z-10 mt-2">
        <App />
        <div className="space-y-8">
          {/* Today's Overview Section */}
          <div className="relative mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Today&apos;s Overview
                </h2>
                <p className="text-blue-200 text-lg">
                  Energy consumption & cost analysis
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 pb-2">
            <div className="flex-1">
              <Todaykwh />
            </div>
            <div className="flex-1">
              <TodayCost />
            </div>
          </div>
        </div>

        {/* Power Analytics Section */}
        <div className="space-y-8 mt-20">
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white ">
                  Power Analytics
                </h2>
                <p className="text-purple-200 text-lg">
                  Real-time power consumption monitoring
                </p>
              </div>
            </div>
          </div>

          <ChartAreaInteractive />
        </div>

        {/* Weekly Analysis Section */}
        {/* <div className="space-y-8 mt-12">
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Weekly Analysis</h2>
                <p className="text-green-200 text-lg">7-day energy consumption trends</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-6">
            <div className="flex-1">
              <UnitkwhChart />
            </div>
            <div className="flex-1">
              <UnitMoneyChart />
            </div>
          </div>
        </div> */}
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

function App() {
  const [data, setData] = useState(null);
  const [blink, setBlink] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real-time data using API routes
  const fetchDeviceData = async () => {
    try {
      const response = await fetch("/api/device-status");
      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        setIsConnected(true);
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      } else {
        console.error("Failed to fetch device data:", result.error);
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDeviceData();

    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(fetchDeviceData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUserManualDownload = () => {
    const link = document.createElement("a");
    link.href = "/user-manual.pdf";
    link.download = "user-manual.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInstallationGuideDownload = () => {
    const link = document.createElement("a");
    link.href = "/Project_Setup_Guide.pdf";
    link.download = "Project_Setup_Guide.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const blinkClass = blink
    ? "opacity-0 transition-opacity duration-150"
    : "opacity-100 transition-opacity duration-150";

  return (
    <div className="font-sans p-6">
      {/* Header Section with Glass Effect */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Real-time Energy Monitoring System
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUserManualDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 active:scale-95 transition-all duration-150 ease-in-out shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                User Manual
              </button>
              <button
                onClick={handleInstallationGuideDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 active:scale-95 transition-all duration-150 ease-in-out shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                Installation Guide
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected
                    ? "bg-green-400 shadow-lg shadow-green-400/50"
                    : "bg-red-400 shadow-lg shadow-red-400/50"
                }`}
              ></div>
              <span className="text-sm text-white font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Section with Glass Effect */}
      {isLoading ? (
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium">Connecting to device...</p>
            </div>
          </div>
        </div>
      ) : data ? (
        <div className="flex gap-6">
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 w-80">
            <div className="flex flex-col space-y-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-200">Time</div>
                  <div
                    className={`font-semibold text-white text-lg ${blinkClass}`}
                  >
                    {new Date(data.time).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-teal-200">
                    Current
                  </div>
                  <div className="font-semibold text-white text-lg">
                    {data.current} mA
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-200">
                    Voltage
                  </div>
                  <div className="font-semibold text-white text-lg">
                    {data.voltage} V
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-red-200">Power</div>
                  <div className="font-semibold text-white text-lg">
                    {data.power} W
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Control on the right */}
          <div className="flex-1">
            <DeviceControl />
          </div>
        </div>
      ) : (
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium">
                Failed to connect to device
              </p>
              <p className="text-red-200 text-sm mt-2">
                Check device connection and try again
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
