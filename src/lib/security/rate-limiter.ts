export interface RateLimitConfig {
  id: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

interface BucketEntry {
  count: number;
  resetAt: number;
}

export const RATE_LIMIT_TIERS = {
  /** Strict brute-force protection for login */
  auth: {
    id: "auth",
    limit: 10,
    windowMs: 60 * 1000, // 10 requests / minute
  },
  /** Anti-spam & double-submit protection for payment, top-up, and billing mutations */
  financial: {
    id: "financial",
    limit: 20,
    windowMs: 60 * 1000, // 20 requests / minute
  },
  /** General API flood protection */
  general: {
    id: "general",
    limit: 120,
    windowMs: 60 * 1000, // 120 requests / minute
  },
} as const;

class InMemoryRateLimiter {
  private buckets = new Map<string, BucketEntry>();
  private lastCleanup = Date.now();
  private readonly cleanupIntervalMs = 60 * 1000;

  private cleanup(now: number) {
    if (now - this.lastCleanup < this.cleanupIntervalMs) return;
    this.lastCleanup = now;
    for (const [key, entry] of this.buckets.entries()) {
      if (now >= entry.resetAt) {
        this.buckets.delete(key);
      }
    }
  }

  check(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    this.cleanup(now);

    const key = `${config.id}:${identifier}`;
    const existing = this.buckets.get(key);

    if (!existing || now >= existing.resetAt) {
      const resetAt = now + config.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        limit: config.limit,
        remaining: Math.max(0, config.limit - 1),
        resetAt,
        retryAfterSeconds: Math.ceil(config.windowMs / 1000),
      };
    }

    if (existing.count >= config.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      return {
        allowed: false,
        limit: config.limit,
        remaining: 0,
        resetAt: existing.resetAt,
        retryAfterSeconds,
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      limit: config.limit,
      remaining: Math.max(0, config.limit - existing.count),
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __kantinpayRateLimiter: InMemoryRateLimiter | undefined;
}

export const rateLimiter = global.__kantinpayRateLimiter || new InMemoryRateLimiter();
if (process.env.NODE_ENV !== "production") {
  global.__kantinpayRateLimiter = rateLimiter;
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
