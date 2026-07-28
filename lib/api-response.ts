import { NextResponse } from "next/server";

/**
 * Uniform JSON envelope for every API route.
 *
 *   { "ok": true|false, "message": string, "data": any?, "code": string? }
 *
 * - `ok`     — true for 2xx, false for 4xx/5xx (consumes / retry logic can switch on it)
 * - `message`— Indonesian human-readable message (kept consistent with old wire so callers don't break)
 * - `data`   — optional payload for success/envelope
 * - `code`   — optional machine-readable error code (e.g. "AUTH_REQUIRED", "RATE_LIMITED")
 */
export function apiResponse<T = unknown>(
  status: number,
  message: string,
  options?: { data?: T; code?: string; headers?: HeadersInit }
) {
  const ok = status >= 200 && status < 300;
  return NextResponse.json(
    { ok, message, data: options?.data, code: options?.code ?? null },
    { status, headers: options?.headers }
  );
}

// Convenience helpers — drop boilerplate at the call site.
export const apiOk = <T = unknown>(
  message: string,
  data?: T,
  headers?: HeadersInit
) => apiResponse<T>(200, message, { data, headers });

export const apiCreated = <T = unknown>(
  message: string,
  data?: T,
  headers?: HeadersInit
) => apiResponse<T>(201, message, { data, headers });

export const apiBadRequest = (
  message: string,
  code = "BAD_REQUEST",
  data?: unknown
) => apiResponse(400, message, { code, data });

export const apiUnauthorized = (
  message = "Akses ditolak. Sesi admin tidak valid.",
  code = "AUTH_REQUIRED"
) => apiResponse(403, message, { code });

export const apiNotFound = (message: string, code = "NOT_FOUND") =>
  apiResponse(404, message, { code });

export const apiRateLimited = (message: string, retryAfterSec?: number) => {
  const headers: HeadersInit = {};
  if (retryAfterSec) headers["Retry-After"] = String(retryAfterSec);
  return apiResponse(429, message, { code: "RATE_LIMITED", headers });
};

export const apiServerError = (
  message = "Terjadi kesalahan pada server.",
  code = "INTERNAL"
) => apiResponse(500, message, { code });

export const apiServiceUnavailable = (
  message: string,
  code = "NOT_CONFIGURED"
) => apiResponse(503, message, { code });
