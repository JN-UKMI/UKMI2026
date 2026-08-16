/**
 * Rate limiting and client IP extraction utilities for API endpoints.
 * 
 * SECURITY NOTE (MEDIUM-2): This uses an in-memory Map. In a serverless 
 * environment (like Vercel), this state is not shared across instances.
 * For a student organization site, this provides sufficient baseline protection.
 * If stricter limits are required in the future, migrate to Upstash Redis
 * or use Vercel Edge Middleware rate limiting.
 */

export interface RateCheckResult {
  blocked: boolean;
  minutesLeft: number;
  count: number;
}

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  blockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function pruneRateLimitMap(now: number) {
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      rateLimitMap.delete(key);
    }
  }
}

/** Extracts client IP address safely from Request headers. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "anonymous-ip";
}

/**
 * Checks if a given key (e.g. IP + prefix) is currently blocked.
 */
export function checkRateLimit(
  key: string,
  now: number = Date.now()
): RateCheckResult {
  pruneRateLimitMap(now);
  const record = rateLimitMap.get(key);
  if (record && record.blockedUntil > now) {
    return {
      blocked: true,
      minutesLeft: Math.max(1, Math.ceil((record.blockedUntil - now) / 60000)),
      count: record.count,
    };
  }
  return { blocked: false, minutesLeft: 0, count: record?.count ?? 0 };
}

/**
 * Records an attempt and blocks if the limit is exceeded.
 * @param key unique identifier (e.g. `article-create:${ip}`)
 * @param maxAttempts maximum allowed attempts before block
 * @param blockDurationMs duration in ms to block when limit reached
 * @param windowMs sliding reset window in ms (if not blocked)
 */
export function recordAttempt(
  key: string,
  maxAttempts: number = 5,
  blockDurationMs: number = 15 * 60 * 1000,
  windowMs: number = 60 * 60 * 1000,
  now: number = Date.now()
): RateCheckResult {
  pruneRateLimitMap(now);
  const prior = rateLimitMap.get(key);

  if (prior && prior.blockedUntil > now) {
    return {
      blocked: true,
      minutesLeft: Math.max(1, Math.ceil((prior.blockedUntil - now) / 60000)),
      count: prior.count,
    };
  }

  // If previous window expired, reset count
  if (!prior || now - prior.firstAttempt > windowMs) {
    const record: RateLimitRecord = { count: 1, firstAttempt: now, blockedUntil: 0 };
    rateLimitMap.set(key, record);
    return { blocked: false, minutesLeft: 0, count: 1 };
  }

  const newCount = prior.count + 1;
  if (newCount > maxAttempts) {
    const record: RateLimitRecord = {
      count: newCount,
      firstAttempt: prior.firstAttempt,
      blockedUntil: now + blockDurationMs,
    };
    rateLimitMap.set(key, record);
    return {
      blocked: true,
      minutesLeft: Math.max(1, Math.ceil(blockDurationMs / 60000)),
      count: newCount,
    };
  }

  rateLimitMap.set(key, { ...prior, count: newCount });
  return { blocked: false, minutesLeft: 0, count: newCount };
}

/** Clears rate limit record for a key. */
export function clearAttempts(key: string) {
  rateLimitMap.delete(key);
}
