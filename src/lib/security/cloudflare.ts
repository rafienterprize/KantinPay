/**
 * Verifies a Cloudflare Turnstile token when CLOUDFLARE_TURNSTILE_SECRET_KEY is configured.
 * In local development (without a Turnstile secret key), verification is skipped gracefully.
 */
export async function verifyCloudflareTurnstile(
  token: string | undefined,
  remoteIp: string,
  expectedAction = "login"
): Promise<{ valid: boolean; error?: string }> {
  const secretKey =
    process.env.TURNSTILE_SECRET || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // Skip when not configured (local dev)
  if (!secretKey) {
    return { valid: true };
  }

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return {
      valid: false,
      error: "Verifikasi keamanan Cloudflare diperlukan. Silakan centang verifikasi terlebih dahulu.",
    };
  }

  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)
  );

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
          remoteip: remoteIp,
        }),
      }
    );

    if (!res.ok) {
      return {
        valid: false,
        error: "Server verifikasi Cloudflare tidak merespons. Silakan coba lagi.",
      };
    }

    const data = (await res.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };

    if (!data.success) {
      return {
        valid: false,
        error: "Verifikasi keamanan Cloudflare gagal. Silakan coba lagi.",
      };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return {
        valid: false,
        error: "Aksi verifikasi Cloudflare tidak cocok.",
      };
    }

    if (
      expectedHostnames.size > 0 &&
      (!data.hostname || !expectedHostnames.has(data.hostname.toLowerCase()))
    ) {
      return {
        valid: false,
        error: "Hostname verifikasi Cloudflare tidak diizinkan.",
      };
    }

    return { valid: true };
  } catch (err) {
    console.error("Cloudflare Turnstile verification error:", err);
    return {
      valid: false,
      error: "Gagal menghubungi server verifikasi Cloudflare.",
    };
  }
}

/**
 * Checks whether the incoming request arrived through Cloudflare Proxy.
 */
export function getCloudflareContext(headers: Headers) {
  return {
    isProxiedByCloudflare: Boolean(headers.get("cf-ray") || headers.get("cf-connecting-ip")),
    cfRay: headers.get("cf-ray") || null,
    cfCountry: headers.get("cf-ipcountry") || null,
  };
}
