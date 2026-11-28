/**
 * Verifies a Cloudflare Turnstile token when CLOUDFLARE_TURNSTILE_SECRET_KEY is configured.
 * In local development (without a Turnstile secret key), verification is skipped gracefully.
 */
export async function verifyCloudflareTurnstile(
  token: string | undefined,
  remoteIp: string
): Promise<{ valid: boolean; error?: string }> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // Skip when not configured (local dev)
  if (!secretKey) {
    return { valid: true };
  }

  if (!token) {
    return {
      valid: false,
      error: "Verifikasi keamanan Cloudflare diperlukan. Silakan muat ulang halaman.",
    };
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", remoteIp);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = (await res.json()) as { success?: boolean };
    if (!data.success) {
      return {
        valid: false,
        error: "Verifikasi keamanan Cloudflare gagal. Silakan coba lagi.",
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
