import { NextResponse } from "next/server";
import { fetchDeviceStatus } from "@/lib/tuya";

export async function GET() {
  try {
    const deviceId = process.env.TUYA_DEVICE_ID;
    if (!deviceId) {
      return NextResponse.json(
        {
          success: false,
          error: "Device ID not configured",
        },
        { status: 500 }
      );
    }

    const status = await fetchDeviceStatus(deviceId);

    if (!status || !Array.isArray(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid response from Tuya API",
        },
        { status: 500 }
      );
    }

    // Find the switch_1 status
    const switchStatus = status.find((s) => s.code === "switch_1");

    if (!switchStatus) {
      return NextResponse.json(
        {
          success: false,
          error: "Switch status not found in device data",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        switch: switchStatus.value, // true for on, false for off
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching switch status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch switch status from Tuya API",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

