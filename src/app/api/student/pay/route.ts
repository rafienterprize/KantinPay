import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = store.getUserById(session.id);
    if (!currentUser || currentUser.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const canteens = store.getCanteens();
    const myTransactions = store.getTransactionsByStudent(currentUser.id).slice(0, 15);
    const billing = store.getClassBilling(currentUser.className || "");

    return NextResponse.json(
      {
        balance: currentUser.balance,
        className: currentUser.className || "",
        billing,
        canteens,
        myTransactions,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Student pay GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data pembayaran kantin." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = store.getUserById(session.id);
    if (!currentUser || currentUser.role !== "student") {
      return NextResponse.json(
        { error: "Hanya akun siswa yang dapat melakukan pembayaran kantin." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { canteenId, amount, note } = body as {
      canteenId?: string;
      amount?: number;
      note?: string;
    };

    if (!canteenId) {
      return NextResponse.json(
        { error: "Silakan pilih kantin tujuan terlebih dahulu." },
        { status: 400 }
      );
    }

    const numericAmount = Math.floor(Number(amount));
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Nominal pembayaran harus lebih besar dari Rp 0." },
        { status: 400 }
      );
    }

    const canteen = store.getCanteenById(canteenId);
    if (!canteen) {
      return NextResponse.json(
        { error: "Kantin tujuan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (canteen.status !== "active") {
      return NextResponse.json(
        { error: `${canteen.name} sedang tutup atau dalam perawatan.` },
        { status: 400 }
      );
    }

    const description = note?.trim()
      ? `Pembayaran ${note.trim()} di ${canteen.name} (Web)`
      : `Pembayaran jajan di ${canteen.name} (Web)`;

    const result = store.processPayment(
      currentUser.id,
      canteen.id,
      numericAmount,
      description
    );

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      transaction: result.transaction,
      remainingBalance: result.remainingBalance,
    });
  } catch (error) {
    console.error("Student pay POST error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pembayaran." },
      { status: 500 }
    );
  }
}
