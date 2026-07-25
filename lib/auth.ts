import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Parses and returns the list of allowed admin email addresses from process.env.ADMIN_EMAILS.
 */
export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || "";
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Checks if a given email is present in the admin allowlist.
 */
export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false;
  const allowlist = getAdminEmails();
  return allowlist.includes(email.trim().toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      if (user?.email) {
        token.isAdmin = isEmailAdmin(user.email);
      } else if (token.email) {
        token.isAdmin = isEmailAdmin(token.email);
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
  secret: process.env.AUTH_SECRET,
});

/**
 * Server-side helper to check if the current user session is an authorized admin.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user?.email && isEmailAdmin(session.user.email));
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
  if (!user || !isEmailAdmin(user.email)) {
    return null;
  }
  return user;
}
