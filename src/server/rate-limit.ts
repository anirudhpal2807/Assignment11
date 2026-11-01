import { env } from "@/lib/env";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private clients = new Map<string, RateLimitRecord>();
  private windowMs = 60 * 1000; // 1 minute

  public check(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = this.clients.get(ip);
    const limit = env.RATE_LIMIT_PER_MIN;

    if (!record || now > record.resetAt) {
      this.clients.set(ip, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return { allowed: true, remaining: limit - 1, resetIn: this.windowMs };
    }

    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.max(0, record.resetAt - now),
      };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: limit - record.count,
      resetIn: Math.max(0, record.resetAt - now),
    };
  }
}

export const rateLimiter = new RateLimiter();
