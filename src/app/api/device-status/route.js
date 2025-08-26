import { NextResponse } from "next/server";
import { fetchDeviceStatus } from "@/lib/tuya";
import { insertDeviceData } from "@/lib/mongodb";

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
      time: doc.timestamp.toISOString(),
      current: getValue(status, "cur_current"),
      voltage: getValue(status, "cur_voltage"),
      power: getValue(status, "cur_power"),
      switch: getValue(status, "switch_1"),
    };

    return NextResponse.json({
      success: true,
      data: transformed,
      raw: status,
    });
  } catch (error) {
    console.error("Error fetching device status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch device status from Tuya API",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function getValue(statusArray, code) {
  const item = statusArray.find((s) => s.code === code);
  return item ? item.value : null;
}

