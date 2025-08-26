"use client";

import * as React from "react";
import { Power, Loader2, Settings } from "lucide-react";

export function DeviceControl() {
  const [switchState, setSwitchState] = React.useState(false);
  const [switchLoading, setSwitchLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);

  // Fetch initial switch status
  React.useEffect(() => {
    const fetchSwitchStatus = async () => {
      try {
        const response = await fetch("/api/switch-status");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setSwitchState(result.data.switch);
          console.log("Current switch status:", result.data.switch);
        } else {
          console.error("Failed to fetch switch status:", result.error);
        }
      } catch (err) {
        console.error("Error fetching switch status:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSwitchStatus();
  }, []);

  const handleSwitchToggle = async () => {
    const newState = !switchState;
    try {
      setSwitchLoading(true);
      const response = await fetch("/api/switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: newState }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSwitchState(newState);
        console.log(`Device switched ${newState ? "on" : "off"} successfully`);
      } else {
        throw new Error(result.error || "Failed to control device switch");
      }
    } catch (err) {
      console.error("Error controlling device switch:", err);
      alert(`Failed to switch device: ${err.message}`);
    } finally {
      setSwitchLoading(false);
    }
  };

  return (
    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
              <Power className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Device Control</h3>
            <p className="text-sm text-blue-200">Power Management</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
          <Settings className="h-4 w-4 text-green-300" />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Status Display */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <span className="text-sm font-semibold text-white mb-3 block">
              Power Status
            </span>
            {initialLoading ? (
              <div className="flex items-center justify-center gap-2 text-blue-200">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full ${
                  switchState
                    ? "bg-green-500/20 border border-green-400/30"
                    : "bg-red-500/20 border border-red-400/30"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    switchState ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    switchState ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {switchState ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Smart Control Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwitchToggle}
            disabled={switchLoading || initialLoading}
            className={`relative group w-20 h-20 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              switchState
                ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                : "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
            }`}
          >
            {/* Loading Overlay */}
            {switchLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}

            {/* Icon */}
            <div className="flex items-center justify-center h-full">
              <Power
                className={`h-8 w-8 text-white transition-all duration-300 ${
                  switchState ? "rotate-0" : "rotate-180"
                }`}
              />
            </div>

            {/* Glow Effect */}
            <div
              className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${
                switchState ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
          </button>
        </div>

        {/* Action Text */}
        <div className="text-center">
          <span className="text-xs text-blue-200">
            {switchLoading
              ? "Processing..."
              : `Click to turn ${switchState ? "OFF" : "ON"}`}
          </span>
        </div>
      </div>
    </div>
  );
}
