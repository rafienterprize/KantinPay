import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const { logId } = await params;
    const user = await getSession(request);
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = store.approveClassLeaderTopUp(logId, user.id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      log: result.log,
    });
  } catch (error) {
    console.error("Approve class leader top-up error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
