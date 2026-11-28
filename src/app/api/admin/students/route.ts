import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";
import { getSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const classFilter = searchParams.get("class") || "";
  const statusFilter = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const students = userService.getStudents(search, classFilter, statusFilter);
  const total = students.length;
  const startIndex = (page - 1) * limit;
  const paginatedStudents = students.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    students: paginatedStudents,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin koperasi yang memiliki hak akses." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { fullName, studentId, email, whatsappNumber, className, isClassLeader, initialBalance } = body;

    if (!fullName || !studentId || !email || !whatsappNumber || !className) {
      return NextResponse.json(
        { error: "Nama lengkap, NIS, email, nomor WhatsApp, dan kelas wajib diisi." },
        { status: 400 }
      );
    }

    const result = await userService.createStudent({
      fullName,
      studentId,
      email,
      whatsappNumber,
      className,
      isClassLeader: Boolean(isClassLeader),
      initialBalance: Number(initialBalance) || 0,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message, user: result.user });
  } catch (err) {
    console.error("Add student error:", err);
    return NextResponse.json({ error: "Gagal menambahkan data siswa." }, { status: 500 });
  }
}
