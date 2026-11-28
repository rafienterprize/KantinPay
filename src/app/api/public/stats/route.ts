import { NextResponse } from "next/server";
import { store } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const canteens = store.getCanteens();
  const activeCanteens = canteens.filter((c) => c.status === "active");

  return NextResponse.json(
    {
      canteenCount: canteens.length,
      activeCanteenCount: activeCanteens.length,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
