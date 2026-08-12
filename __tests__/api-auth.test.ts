import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// api-auth mengimpor ./auth yang memuat NextAuth (butuh next/server + env Google).
// Fungsi yang diuji di sini murni — mock modulnya agar NextAuth tidak ter-load.
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => null),
  isEmailAdmin: vi.fn(() => false),
}));

import {
  checkRateLimit,
  clearAttempts,
  getClientIp,
  isPasscodeConfigured,
  recordFailedAttempt,
  verifyPasscode,
} from "@/lib/api-auth";

const SECRET = "Semangat25";

beforeEach(() => {
  process.env.KODE_AKSES_PENGURUS = SECRET;
});

afterEach(() => {
  delete process.env.KODE_AKSES_PENGURUS;
  vi.restoreAllMocks();
});

describe("getClientIp", () => {
  it("takes the first entry of x-forwarded-for", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.7");
  });

  it("falls back to anonymous-ip", () => {
    expect(getClientIp(new Request("https://example.com"))).toBe("anonymous-ip");
  });
});

describe("verifyPasscode", () => {
  it("returns true for the correct passcode", () => {
    expect(verifyPasscode(SECRET)).toBe(true);
  });

  it("returns false for wrong passcode", () => {
    expect(verifyPasscode("salah")).toBe(false);
  });

  it("returns false when env is not configured (fail-closed)", () => {
    delete process.env.KODE_AKSES_PENGURUS;
    expect(verifyPasscode(SECRET)).toBe(false);
  });

  it("returns false for null/undefined input", () => {
    expect(verifyPasscode(null)).toBe(false);
    expect(verifyPasscode(undefined)).toBe(false);
  });
});

describe("isPasscodeConfigured", () => {
  it("reflects env presence", () => {
    expect(isPasscodeConfigured()).toBe(true);
    delete process.env.KODE_AKSES_PENGURUS;
    expect(isPasscodeConfigured()).toBe(false);
  });
});

describe("rate limiting", () => {
  const IP = "203.0.113.99";

  it("starts unblocked", () => {
    expect(checkRateLimit(IP).blocked).toBe(false);
  });

  it("blocks after MAX_FAILED_ATTEMPTS (5) failed attempts", () => {
    for (let i = 1; i <= 4; i++) {
      const r = recordFailedAttempt(IP);
      expect(r.blocked).toBe(false);
      expect(r.count).toBe(i);
    }
    const blocked = recordFailedAttempt(IP);
    expect(blocked.blocked).toBe(true);
    expect(blocked.minutesLeft).toBe(15);
    expect(checkRateLimit(IP).blocked).toBe(true);
  });

  it("clearAttempts resets the block", () => {
    for (let i = 0; i < 5; i++) recordFailedAttempt(IP);
    expect(checkRateLimit(IP).blocked).toBe(true);
    clearAttempts(IP);
    expect(checkRateLimit(IP).blocked).toBe(false);
  });

  it("prunes expired blocks when checked later", () => {
    for (let i = 0; i < 5; i++) recordFailedAttempt(IP);
    const now = Date.now();
    // Block until now + 15min; advance time past expiry.
    const later = now + 16 * 60 * 1000;
    expect(checkRateLimit(IP, later).blocked).toBe(false);
  });
});
