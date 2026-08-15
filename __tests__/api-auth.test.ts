import { beforeEach, describe, expect, it } from "vitest";
import {
  checkRateLimit,
  clearAttempts,
  getClientIp,
  recordAttempt,
} from "@/lib/api-auth";

describe("getClientIp", () => {
  it("takes the first entry of x-forwarded-for", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.7");
  });

  it("takes x-real-ip if present", () => {
    const request = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.22" },
    });
    expect(getClientIp(request)).toBe("198.51.100.22");
  });

  it("falls back to anonymous-ip", () => {
    expect(getClientIp(new Request("https://example.com"))).toBe("anonymous-ip");
  });
});

describe("generic rate limiting", () => {
  const KEY = "test-rate-limit-key";

  beforeEach(() => {
    clearAttempts(KEY);
  });

  it("starts unblocked", () => {
    expect(checkRateLimit(KEY).blocked).toBe(false);
  });

  it("allows attempts below maximum limit", () => {
    const r1 = recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);
    expect(r1.blocked).toBe(false);
    expect(r1.count).toBe(1);

    const r2 = recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);
    expect(r2.blocked).toBe(false);
    expect(r2.count).toBe(2);

    const r3 = recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);
    expect(r3.blocked).toBe(false);
    expect(r3.count).toBe(3);
  });

  it("blocks when maximum attempts are exceeded", () => {
    recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);
    recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);
    recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);

    const blocked = recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);
    expect(blocked.blocked).toBe(true);
    expect(blocked.minutesLeft).toBe(15);
    expect(checkRateLimit(KEY).blocked).toBe(true);
  });

  it("clearAttempts resets the block", () => {
    for (let i = 0; i < 4; i++) {
      recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000);
    }
    expect(checkRateLimit(KEY).blocked).toBe(true);
    clearAttempts(KEY);
    expect(checkRateLimit(KEY).blocked).toBe(false);
  });

  it("prunes expired blocks when checked later", () => {
    const now = 1000000;
    for (let i = 0; i < 4; i++) {
      recordAttempt(KEY, 3, 15 * 60 * 1000, 60 * 60 * 1000, now);
    }
    expect(checkRateLimit(KEY, now).blocked).toBe(true);
    // After 16 minutes (past 15 minute block duration)
    expect(checkRateLimit(KEY, now + 16 * 60 * 1000).blocked).toBe(false);
  });
});
