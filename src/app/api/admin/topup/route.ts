import { NextResponse } from "next/server";
import { topupService } from "@/services/topup.service";
import { getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Hanya pengurus koperasi yang berhak melakukan top up saldo." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { studentId, amount } = body;

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Nominal top up tidak valid. Masukkan jumlah di atas 0." }, { status: 400 });
    }

    const result = topupService.performTopUp(studentId, parsedAmount, session.id);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Top up error:", err);
    return NextResponse.json({ error: "Gagal memproses top up saldo." }, { status: 500 });
  }
}
