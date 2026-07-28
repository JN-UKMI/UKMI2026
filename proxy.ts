import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Build the Content-Security-Policy header for the current request.
 * Uses a per-request nonce so we can drop `'unsafe-inline'` from the
 * `script-src` directive. `'strict-dynamic'` cascades trust to scripts
 * loaded by trusted (nonced) scripts, which is the modern recommendation.
 */
function buildCsp(nonce: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    isProd ? "" : "'unsafe-eval'",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io https://lh3.googleusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.sanity.io https://lh3.googleusercontent.com",
    "frame-src 'self' https://www.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

/**
 * Generate a cryptographically-random nonce per request.
 * Uses the Edge runtime's `crypto.randomUUID()` (available since Next 13.4+).
 */
function generateNonce(): string {
  // Strip dashes for a shorter, URL-safe token (~32 chars)
  return crypto.randomUUID().replace(/-/g, "");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Generate per-request nonce and inject it into request headers so
  //    server components / layouts can read it via `next/headers`.
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // 2. Compute the base response and attach the dynamic CSP header.
  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  // 3. Admin route protection (only on /admin paths; matcher below
  //    already filters to admin).
  if (pathname.startsWith("/admin")) {
    const session = await auth();

    if (!session || !session.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      response = NextResponse.redirect(loginUrl);
      // Preserve the nonce + CSP on the redirect too
      response.headers.set("Content-Security-Policy", csp);
      response.headers.set("x-nonce", nonce);
    } else if (!session.user.isAdmin) {
      response = NextResponse.redirect(new URL("/403", request.url));
      response.headers.set("Content-Security-Policy", csp);
      response.headers.set("x-nonce", nonce);
    }
  }

  return response;
}

export const config = {
  /**
   * Run the proxy on every page route so we attach the nonce + CSP,
   * but skip Next.js internals, API routes, and static asset paths
   * for performance. Admin protection happens inside `proxy()` for
   * any path that happens to start with `/admin` (covered above).
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
