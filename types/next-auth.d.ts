/**
 * Type augmentation for NextAuth v5 (beta).
 *
 * `lib/auth.ts` mutates `session.user.isAdmin` and `token.isAdmin` in the
 * `jwt` and `session` callbacks. Without module augmentation, TypeScript
 * sees these as dynamic additions and won't type-check callers like:
 *
 *   if (session.user.isAdmin) { ... }   // <- should compile as boolean
 *
 * This declaration file makes `isAdmin` a typed property on the official
 * `Session`, `User`, and `JWT` shapes so consumers get full type safety.
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /** Shape returned from `auth()` / `useSession()`. */
  interface Session {
    user: DefaultSession["user"] & {
      isAdmin: boolean;
    };
  }

  /** Shape returned in the `jwt` callback `user` parameter (first call). */
  interface User {
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Shape of the JWT token used by the `jwt` callback. */
  interface JWT {
    isAdmin?: boolean;
  }
}
