import { NextRequest, NextResponse } from "next/server";
import {
  rateLimiter,
  RATE_LIMIT_TIERS,
  getClientIp,
  RateLimitConfig,
} from "@/lib/security/rate-limiter";

function resolveRateLimitTier(pathname: string, method: string): RateLimitConfig {
  // 1. Strict anti-brute-force on Login
  if (pathname === "/api/auth/login" && method === "POST") {
    return RATE_LIMIT_TIERS.auth;
  }

  // 2. Anti-spam & double-submit protection on financial mutations
  const isMutation = method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE";
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const clientIp = getClientIp(request.headers);
  const tier = resolveRateLimitTier(pathname, request.method);
  const result = rateLimiter.check(clientIp, tier);

  if (!result.allowed) {
    return NextResponse.json(
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
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
