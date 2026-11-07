import { NextResponse } from "next/server";
import { getPublicShowcaseData } from "@/server/showcase-service";

export async function GET() {
  try {
    const data = await getPublicShowcaseData();
    return NextResponse.json(
      { success: true, ...data },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to load showcase data" },
      { status: 500 }
    );
  }
}
