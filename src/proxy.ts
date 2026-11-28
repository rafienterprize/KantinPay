import { NextRequest, NextResponse } from "next/server";
import {
  rateLimiter,
  RATE_LIMIT_TIERS,
  getClientIp,
  RateLimitConfig,
} from "@/lib/security/rate-limiter";
import { getCloudflareContext } from "@/lib/security/cloudflare";

function resolveRateLimitTier(pathname: string, method: string): RateLimitConfig {
  // 1. Strict anti-brute-force on Login
  if (pathname === "/api/auth/login" && method === "POST") {
    return RATE_LIMIT_TIERS.auth;
  }

  // 2. Anti-spam & double-submit protection on financial mutations
  const isMutation =
    method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE";
  if (
    isMutation &&
    (pathname === "/api/student/pay" ||
      pathname === "/api/class-leader/topup" ||
      pathname === "/api/admin/topup" ||
      pathname.endsWith("/pay-billing") ||
      pathname.endsWith("/approve") ||
      pathname.endsWith("/reject"))
  ) {
    return RATE_LIMIT_TIERS.financial;
  }

  // 3. General API rate limit
  return RATE_LIMIT_TIERS.general;
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cf = getCloudflareContext(request.headers);

  // Optional strict Origin Lock: when REQUIRE_CLOUDFLARE_PROXY=true in production,
  // reject direct requests that bypass Cloudflare Proxy.
  if (
    process.env.REQUIRE_CLOUDFLARE_PROXY === "true" &&
    !cf.isProxiedByCloudflare
  ) {
    return NextResponse.json(
      { error: "Akses langsung ditolak. Permintaan harus melalui Cloudflare Proxy." },
      { status: 403 }
    );
  }

  // Apply tiered rate limiting to all /api/* routes using real Cloudflare client IP
  if (pathname.startsWith("/api/")) {
    const clientIp = getClientIp(request.headers);
    const tier = resolveRateLimitTier(pathname, request.method);
    const result = rateLimiter.check(clientIp, tier);

    if (!result.allowed) {
      const blockedRes = NextResponse.json(
        {
          error: `Terlalu banyak permintaan. Silakan tunggu ${result.retryAfterSeconds} detik sebelum mencoba lagi.`,
          retryAfter: result.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfterSeconds),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
          },
        }
      );
      return applySecurityHeaders(blockedRes);
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
    if (cf.cfRay) {
      response.headers.set("X-CF-Proxy-Verified", "true");
    }
    return applySecurityHeaders(response);
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/login",
    "/admin/:path*",
    "/student/:path*",
    "/merchant/:path*",
  ],
};
