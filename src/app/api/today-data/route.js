import { NextResponse } from "next/server";
import { getTodayData } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get("timezone") || "Asia/Dhaka";

    const data = await getTodayData(timezone);

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching today's data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch today's data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

