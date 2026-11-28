import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

// GET - Get all class leader top-up logs (pending only for admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getSession(request);
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = store.getPendingClassLeaderTopUps();
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Get class leader top-ups error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
