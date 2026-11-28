import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { createSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/security/rate-limiter";
import { loginBruteForceGuard } from "@/lib/security/brute-force";
import { verifyCloudflareTurnstile } from "@/lib/security/cloudflare";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request.headers);
    const body = await request.json();
    const { email, password, role, turnstileToken } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Check progressive brute-force lockout for (Cloudflare real IP + email)
    const lockStatus = loginBruteForceGuard.checkLock(clientIp, email);
    if (lockStatus.locked) {
      const minutes = Math.ceil(lockStatus.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login gagal. Akun dikunci sementara selama ${minutes} menit untuk keamanan.`,
          retryAfter: lockStatus.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(lockStatus.retryAfterSeconds) },
        }
      );
    }

    // 2. Verify Cloudflare Turnstile token (automatically enforced when secret key is configured)
    const turnstileResult = await verifyCloudflareTurnstile(turnstileToken, clientIp);
    if (!turnstileResult.valid) {
      return NextResponse.json(
        { error: turnstileResult.error || "Verifikasi keamanan gagal." },
        { status: 403 }
      );
    }

    // 3. Authenticate credentials
    const result = await authService.authenticate(email, password);
    if (result.error || !result.user) {
      const failState = loginBruteForceGuard.recordFailure(clientIp, email);
      if (failState.locked) {
        return NextResponse.json(
          {
            error:
              "Batas 5x percobaan login gagal tercapai. Akses login dikunci sementara selama 15 menit.",
            retryAfter: failState.retryAfterSeconds,
          },
          {
            status: 429,
            headers: { "Retry-After": String(failState.retryAfterSeconds) },
          }
        );
      }

      return NextResponse.json(
        {
          error: `${result.error || "Autentikasi gagal."} (Sisa percobaan: ${failState.remainingAttempts}x)`,
        },
        { status: 401 }
      );
    }

    // 4. Role check
    if (role && result.user.role !== role) {
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

    // 5. Success -> clear brute-force counter & issue session
    loginBruteForceGuard.reset(clientIp, email);
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
