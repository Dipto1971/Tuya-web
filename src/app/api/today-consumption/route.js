import { NextResponse } from "next/server";
import { getTodayConsumption } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get("timezone") || "Asia/Dhaka";

    const consumption = await getTodayConsumption(timezone);

    return NextResponse.json({
      success: true,
      data: consumption,
    });
  } catch (error) {
    console.error("Error calculating today's consumption:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate today's consumption",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

