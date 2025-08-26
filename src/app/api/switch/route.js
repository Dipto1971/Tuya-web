import { NextResponse } from "next/server";
import { controlDeviceSwitch } from "@/lib/tuya";

export async function POST(request) {
  try {
    const { state } = await request.json();

    if (typeof state !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid state parameter. Must be true (on) or false (off)",
        },
        { status: 400 }
      );
    }

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

    const result = await controlDeviceSwitch(deviceId, state);

    console.log("Tuya API response:", JSON.stringify(result, null, 2));

    if (result && result.success !== false) {
      return NextResponse.json({
        success: true,
        message: `Device switched ${state ? "on" : "off"} successfully`,
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to control device switch",
          data: result,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error controlling device switch:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to control device switch",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

