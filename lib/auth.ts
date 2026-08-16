import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getSupabaseAdmin } from "./supabase";

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
if (process.env.NODE_ENV === "production" && !authSecret) {
  throw new Error("AUTH_SECRET harus dikonfigurasi pada production.");
}

/**
 * Parses and returns the list of allowed admin email addresses from process.env.ADMIN_EMAILS.
 */
export function getEnvAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || "";
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Fetches all allowed admin emails from Supabase table + process.env.ADMIN_EMAILS.
 */
export async function getAdminEmails(): Promise<string[]> {
  const envEmails = getEnvAdminEmails();

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("admin_emails")
        .select("email");

      if (!error && Array.isArray(data)) {
        const dbEmails = data
          .map((row: { email: string }) => row.email?.trim().toLowerCase())
          .filter(Boolean);
        return Array.from(new Set([...envEmails, ...dbEmails]));
      }
    }
  } catch {
    // Fallback gracefully to envEmails if database is not reachable
  }

  return envEmails;
}

/**
 * Checks if a given email is present in the admin allowlist (Async check with Supabase DB + env).
 */
export async function isEmailAdminAsync(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const allowlist = await getAdminEmails();
  return allowlist.includes(email.trim().toLowerCase());
}

/**
 * Synchronous check against process.env.ADMIN_EMAILS (for quick sync filters).
 */
export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false;
  const allowlist = getEnvAdminEmails();
  return allowlist.includes(email.trim().toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/403",
  },
  callbacks: {
    async jwt({ token, user }) {
      const emailToCheck = user?.email || token?.email;
      if (emailToCheck) {
        token.isAdmin = await isEmailAdminAsync(emailToCheck);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
});

/**
 * Server-side helper to check if the current user session is an authorized admin.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user?.email && (await isEmailAdminAsync(session.user.email)));
}

/**
 * Server-side helper to fetch the current authenticated user session.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Server-side protection helper that returns user if authorized admin, or null/false if unauthorized.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !(await isEmailAdminAsync(user.email))) {
    return null;
  }
  return user;
}

