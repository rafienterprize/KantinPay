import { NextResponse } from "next/server";
import { canteenService } from "@/services/canteen.service";
import { getSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const statusFilter = searchParams.get("status") || "";
  const sortBy = searchParams.get("sortBy") || "name";

  let canteens = canteenService.getCanteens(search, categoryFilter, statusFilter);

  if (sortBy === "sales") {
    canteens = [...canteens].sort((a, b) => b.dailyTotal - a.dailyTotal);
  } else if (sortBy === "transactions") {
    canteens = [...canteens].sort((a, b) => b.dailyCount - a.dailyCount);
  } else {
    canteens = [...canteens].sort((a, b) => a.name.localeCompare(b.name));
  }

  return NextResponse.json({ canteens });
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, ownerName, whatsappNumber, description, category } = body;

    if (!name || !ownerName || !whatsappNumber) {
      return NextResponse.json({ error: "Nama kantin, pemilik, dan WhatsApp wajib diisi." }, { status: 400 });
    }

    const result = canteenService.createCanteen({
      name,
      ownerName,
      whatsappNumber,
      description,
      category,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Create tenant error:", err);
    return NextResponse.json({ error: "Gagal menambahkan kantin." }, { status: 500 });
  }
}
