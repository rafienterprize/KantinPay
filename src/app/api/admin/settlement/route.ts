import { NextResponse } from "next/server";
import { settlementService } from "@/services/settlement.service";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const settlements = settlementService.getAllSettlements();
  return NextResponse.json({ settlements });
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { settlementId, action } = body;

    if (!settlementId) {
      return NextResponse.json({ error: "ID settlement harus disertakan." }, { status: 400 });
    }

    if (action === "settle") {
      const res = settlementService.settleMerchant(settlementId, session.id);
      return NextResponse.json(res);
    } else if (action === "process") {
      const res = settlementService.processMerchant(settlementId, session.id);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: "Aksi tidak dikenali." }, { status: 400 });
  } catch (err) {
    console.error("Settlement action error:", err);
    return NextResponse.json({ error: "Gagal memproses status settlement." }, { status: 500 });
  }
}
