import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const result = await authService.authenticate(email, password);
    if (result.error || !result.user) {
      return NextResponse.json(
        { error: result.error || "Autentikasi gagal." },
        { status: 401 }
      );
    }

    // Role check
    if (role && result.user.role !== role) {
      // Friendly message explaining role mismatch
      const roleNames: Record<string, string> = {
        admin: "Pengurus Koperasi / Admin",
        student: "Siswa",
        merchant: "Penjual / Tenant Kantin",
      };
      return NextResponse.json(
        {
          error: `Akun ini terdaftar sebagai ${roleNames[result.user.role] || result.user.role}, bukan sebagai ${roleNames[role] || role}. Silakan pilih role yang sesuai.`,
        },
        { status: 403 }
      );
    }

    const token = await createSession(result.user);

    let redirectUrl = "/";
    if (result.user.role === "admin") redirectUrl = "/admin";
    else if (result.user.role === "student") redirectUrl = "/student";
    else if (result.user.role === "merchant") redirectUrl = "/merchant";

    return NextResponse.json({
      success: true,
      user: result.user,
      token,
      redirectUrl,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat memproses login." },
      { status: 500 }
    );
  }
}
