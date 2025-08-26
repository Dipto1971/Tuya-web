"use client";

import React, { useEffect, useState } from "react";

export function DebugInfo() {
  const [debugData, setDebugData] = useState({
    deviceStatus: null,
    todayConsumption: null,
    switchStatus: null,
    errors: [],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      const results = {
        deviceStatus: null,
        todayConsumption: null,
        switchStatus: null,
        errors: [],
      };

      // Test device status
      try {
        console.log("Testing /api/device-status...");
        const deviceResponse = await fetch("/api/device-status");
        console.log("Device status response status:", deviceResponse.status);

        if (!deviceResponse.ok) {
          throw new Error(
            `HTTP ${deviceResponse.status}: ${deviceResponse.statusText}`
          );
        }

        const deviceData = await deviceResponse.json();
        console.log("Device status data:", deviceData);
        results.deviceStatus = deviceData;
      } catch (error) {
        console.error("Device status error:", error);
        results.errors.push(`Device Status: ${error.message}`);
      }

      // Test today consumption
      try {
        console.log("Testing /api/today-consumption...");
        const consumptionResponse = await fetch("/api/today-consumption");
        console.log("Consumption response status:", consumptionResponse.status);

        if (!consumptionResponse.ok) {
          throw new Error(
            `HTTP ${consumptionResponse.status}: ${consumptionResponse.statusText}`
          );
        }

        const consumptionData = await consumptionResponse.json();
        console.log("Consumption data:", consumptionData);
        results.todayConsumption = consumptionData;
      } catch (error) {
        console.error("Consumption error:", error);
        results.errors.push(`Today Consumption: ${error.message}`);
      }

      // Test switch status
      try {
        console.log("Testing /api/switch-status...");
        const switchResponse = await fetch("/api/switch-status");
        console.log("Switch status response status:", switchResponse.status);

        if (!switchResponse.ok) {
          throw new Error(
            `HTTP ${switchResponse.status}: ${switchResponse.statusText}`
          );
        }

        const switchData = await switchResponse.json();
        console.log("Switch status data:", switchData);
        results.switchStatus = switchData;
      } catch (error) {
        console.error("Switch status error:", error);
        results.errors.push(`Switch Status: ${error.message}`);
      }

      setDebugData(results);
    };

    fetchAllData();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="text-lg font-bold mb-2">Debug Info</h3>

      {debugData.errors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-red-400">Errors:</h4>
          <ul className="text-sm">
            {debugData.errors.map((error, index) => (
              <li key={index} className="text-red-300">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Device Status:</span>
          <span
            className={
              debugData.deviceStatus?.success
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {debugData.deviceStatus ? "✅" : "❌"}
          </span>
        </div>

        <div>
          <span className="font-semibold">Today Consumption:</span>
          <span
            className={
              debugData.todayConsumption?.success
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {debugData.todayConsumption ? "✅" : "❌"}
          </span>
        </div>

        <div>
          <span className="font-semibold">Switch Status:</span>
          <span
            className={
              debugData.switchStatus?.success
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {debugData.switchStatus ? "✅" : "❌"}
          </span>
        </div>
      </div>

      {debugData.deviceStatus && (
        <details className="mt-2">
          <summary className="cursor-pointer text-blue-400">
            Device Data
          </summary>
          <pre className="text-xs mt-1 overflow-auto">
            {JSON.stringify(debugData.deviceStatus, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

