import { NextResponse } from "next/server";
import { fetchDeviceStatus } from "@/lib/tuya";
import { insertDeviceData } from "@/lib/mongodb";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendData = (data) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      const sendError = (error) => {
        const message = `data: ${JSON.stringify({ error: error.message })}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial connection message
      sendData({ type: "connected", timestamp: new Date().toISOString() });

      // Poll device status every 5 seconds
      const interval = setInterval(async () => {
        try {
          const deviceId = process.env.TUYA_DEVICE_ID;
          if (!deviceId) {
            sendError(new Error("Device ID not configured"));
            return;
          }

          const status = await fetchDeviceStatus(deviceId);

          if (!status || !Array.isArray(status)) {
            sendError(new Error("Invalid response from Tuya API"));
            return;
          }

          // Store the data in MongoDB
          const doc = {
            timestamp: new Date(),
            status,
          };

          try {
            await insertDeviceData(doc);
          } catch (dbError) {
            console.error("Error storing data in MongoDB:", dbError);
            // Continue even if DB storage fails
          }

          // Transform the data for the response
          const transformed = {
            type: "device_status",
            time: doc.timestamp.toISOString(),
            current: getValue(status, "cur_current"),
            voltage: getValue(status, "cur_voltage"),
            power: getValue(status, "cur_power"),
            switch: getValue(status, "switch_1"),
          };

          sendData(transformed);
        } catch (error) {
          console.error("Error in SSE polling:", error);
          sendError(error);
        }
      }, 5000);

      // Clean up on disconnect
      return () => {
        clearInterval(interval);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}

function getValue(statusArray, code) {
  const item = statusArray.find((s) => s.code === code);
  return item ? item.value : null;
}

