import { auth, isEmailAdmin } from "./auth";

/**
 * Shared admin + passcode authentication helpers.
 *
 * Passcode path FAILS CLOSED if `KODE_AKSES_PENGURUS` env isn't set —
 * never falls back to a hardcoded default, unlike the previous version.
 */

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Single in-memory rate-limit state shared across all routes that need it.
// Periodically pruned (NOT grown unbounded). Suitable for single-instance
// production; for multi-instance fallback use a KV store (Redis/Upstash).
const rateLimitMap = new Map<string, { count: number; blockedUntil: number }>();

function pruneRateLimitMap(now: number) {
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      rateLimitMap.delete(ip);
    }
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "anonymous-ip";
}

export interface RateCheckResult {
  blocked: boolean;
  minutesLeft: number;
  count: number;
}

/** Returns current block state for `ip`. */
export function checkRateLimit(
  ip: string,
  now: number = Date.now()
): RateCheckResult {
  pruneRateLimitMap(now);
  const record = rateLimitMap.get(ip);
  if (record && record.blockedUntil > now) {
    return {
      blocked: true,
      minutesLeft: Math.ceil((record.blockedUntil - now) / 60000),
      count: record.count,
    };
  }
  return { blocked: false, minutesLeft: 0, count: 0 };
}

/** Increments the failure count and possibly blocks the IP. */
export function recordFailedAttempt(
  ip: string,
  now: number = Date.now()
): RateCheckResult {
  pruneRateLimitMap(now);
  const prior = rateLimitMap.get(ip) ?? { count: 0, blockedUntil: 0 };
  const count = prior.count + 1;
  if (count >= MAX_FAILED_ATTEMPTS) {
    const record = { count, blockedUntil: now + BLOCK_DURATION_MS };
    rateLimitMap.set(ip, record);
    return { blocked: true, minutesLeft: 15, count };
  }
  rateLimitMap.set(ip, { count, blockedUntil: 0 });
  return { blocked: false, minutesLeft: 0, count };
}

/** Clears a successful attempt. */
export function clearAttempts(ip: string) {
  rateLimitMap.delete(ip);
}

/**
 * Verify pengurus passcode against env. Returns false (never throws) if env
 * is missing — fail-closed. Callers should surface a 5xx NOT_CONFIGURED.
 */
export function verifyPasscode(passcode: string | null | undefined): boolean {
  if (typeof passcode !== "string") return false;
  const expected = process.env.KODE_AKSES_PENGURUS;
  if (typeof expected !== "string" || expected.length === 0) return false;
  return passcode === expected;
}

/** Have an env but want to know if it's configured (use for 503). */
export function isPasscodeConfigured(): boolean {
  const expected = process.env.KODE_AKSES_PENGURUS;
  return typeof expected === "string" && expected.length > 0;
}

/**
 * Combined check: returns `true` if EITHER the caller holds a valid admin
 * session OR a matching passcode. Use as the gate for write endpoints that
 * the upload route / artikel create route already expose.
 */
export async function authorizeAdminOrPasscode(
  request: Request,
  providedPasscode: string | null | undefined
): Promise<
  | { authorized: true; isAdmin: boolean }
  | { authorized: false; reason: "unauthorized" | "not_configured" }
> {
  const session = await auth();
  const userEmail = session?.user?.email as string | undefined;
  const isAdmin = userEmail ? isEmailAdmin(userEmail) : false;
  if (isAdmin) return { authorized: true, isAdmin: true };

  if (!isPasscodeConfigured()) {
    return { authorized: false, reason: "not_configured" };
  }
  if (verifyPasscode(providedPasscode)) {
    return { authorized: true, isAdmin: false };
  }
  return { authorized: false, reason: "unauthorized" };
}
