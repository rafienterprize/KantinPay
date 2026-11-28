interface FailedLoginEntry {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

class LoginBruteForceGuard {
  private entries = new Map<string, FailedLoginEntry>();

  private getKey(ip: string, identifier: string): string {
    return `${ip}:${identifier.toLowerCase().trim()}`;
  }

  checkLock(ip: string, identifier: string): {
    locked: boolean;
    retryAfterSeconds: number;
    remainingAttempts: number;
  } {
    const now = Date.now();
    const key = this.getKey(ip, identifier);
    const entry = this.entries.get(key);

    if (!entry) {
      return {
        locked: false,
        retryAfterSeconds: 0,
        remainingAttempts: MAX_FAILED_ATTEMPTS,
      };
    }

    if (entry.lockedUntil && now < entry.lockedUntil) {
      return {
        locked: true,
        retryAfterSeconds: Math.max(1, Math.ceil((entry.lockedUntil - now) / 1000)),
        remainingAttempts: 0,
      };
    }

    // Reset expired window or expired lock
    if (
      (entry.lockedUntil && now >= entry.lockedUntil) ||
      now - entry.firstAttemptAt > ATTEMPT_WINDOW_MS
    ) {
      this.entries.delete(key);
      return {
        locked: false,
        retryAfterSeconds: 0,
        remainingAttempts: MAX_FAILED_ATTEMPTS,
      };
    }

    return {
      locked: false,
      retryAfterSeconds: 0,
      remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - entry.attempts),
    };
  }

  recordFailure(ip: string, identifier: string): {
    locked: boolean;
    remainingAttempts: number;
    retryAfterSeconds: number;
  } {
    const now = Date.now();
    const key = this.getKey(ip, identifier);
    const existing = this.entries.get(key);

    if (!existing || now - existing.firstAttemptAt > ATTEMPT_WINDOW_MS) {
      this.entries.set(key, {
        attempts: 1,
        firstAttemptAt: now,
        lockedUntil: null,
      });
      return {
        locked: false,
        remainingAttempts: MAX_FAILED_ATTEMPTS - 1,
        retryAfterSeconds: 0,
      };
    }

    existing.attempts += 1;
    if (existing.attempts >= MAX_FAILED_ATTEMPTS) {
      existing.lockedUntil = now + LOCKOUT_DURATION_MS;
      return {
        locked: true,
        remainingAttempts: 0,
        retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      };
    }

    return {
      locked: false,
      remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - existing.attempts),
      retryAfterSeconds: 0,
    };
  }

  reset(ip: string, identifier: string) {
    const key = this.getKey(ip, identifier);
    this.entries.delete(key);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __kantinpayBruteForceGuard: LoginBruteForceGuard | undefined;
}

export const loginBruteForceGuard =
  global.__kantinpayBruteForceGuard || new LoginBruteForceGuard();

if (process.env.NODE_ENV !== "production") {
  global.__kantinpayBruteForceGuard = loginBruteForceGuard;
}
