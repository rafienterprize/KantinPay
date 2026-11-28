import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ className: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { className } = await params;
    const decodedClassName = decodeURIComponent(className);
    const body = await req.json().catch(() => ({}));
    const { mode = "full", amount } = body as { mode?: "full" | "partial"; amount?: number };

    if (mode === "partial" && (!amount || Number(amount) <= 0)) {
      return NextResponse.json(
        { error: "Masukkan nominal pembayaran yang valid." },
        { status: 400 }
      );
    }

    const result = store.payClassBilling(
      decodedClassName,
      mode === "full" ? undefined : Number(amount),
      session.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      billing: result.billing,
    });
  } catch (error) {
    console.error("Pay class billing error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pembayaran tagihan kelas." },
      { status: 500 }
    );
  }
}
