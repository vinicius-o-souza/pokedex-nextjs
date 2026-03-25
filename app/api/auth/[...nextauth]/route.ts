import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ---------------------------------------------------------------------------
// TypeScript module augmentation
// Extend the built-in NextAuth types so that `session.accessToken` and the
// raw token fields are available without casting throughout the application.
// ---------------------------------------------------------------------------
declare module "next-auth" {
  interface Session {
    /** Drupal OAuth2 access token, ready to pass as a Bearer header. */
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    /** Unix timestamp (seconds) at which the access token expires. */
    expiresAt: number;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
