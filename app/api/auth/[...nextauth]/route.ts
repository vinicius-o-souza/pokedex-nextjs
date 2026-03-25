import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchAccessToken, refreshAccessToken } from "@/lib/drupal/auth";

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

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/** Convert expires_in (seconds from now) to an absolute Unix timestamp. */
function toExpiresAt(expiresIn: number): number {
  return Math.floor(Date.now() / 1000) + expiresIn;
}

// ---------------------------------------------------------------------------
// NextAuth configuration
// ---------------------------------------------------------------------------

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Drupal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const token = await fetchAccessToken(
            credentials.email,
            credentials.password,
          );

          // Return a minimal user object — NextAuth stores this in the JWT.
          // The actual user profile can be fetched later with the access_token
          // if needed; here we only persist what the session requires.
          return {
            id: credentials.email,
            email: credentials.email,
            // Pass token fields through; they will be picked up in the `jwt`
            // callback below via the `user` object.
            // @ts-expect-error — extra fields on User are forwarded to jwt callback
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: toExpiresAt(token.expires_in),
          };
        } catch {
          // Returning null causes NextAuth to show the "CredentialsSignin" error.
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * JWT callback — runs on sign-in and on every session access.
     *
     * On first sign-in `user` is populated with the object returned by
     * `authorize`; on subsequent calls only `token` is present.
     *
     * We implement token refresh here: if the access token has expired we
     * transparently exchange the refresh_token for a new token pair before
     * the session is returned to the client.
     */
    async jwt({ token, user }) {
      // First sign-in: hydrate the JWT with the token fields from authorize()
      if (user) {
        const u = user as typeof user & {
          accessToken: string;
          refreshToken: string;
          expiresAt: number;
        };
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.expiresAt = u.expiresAt;
        return token;
      }

      // Access token is still valid — return as-is
      if (Date.now() / 1000 < token.expiresAt - 30) {
        return token;
      }

      // Access token has expired — attempt a silent refresh
      try {
        const refreshed = await refreshAccessToken(token.refreshToken);
        return {
          ...token,
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token,
          expiresAt: toExpiresAt(refreshed.expires_in),
        };
      } catch {
        // Refresh failed (e.g. the refresh token was revoked).
        // Returning the token with an `error` field will cause the session
        // callback to surface it; the client should redirect to sign-in.
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    /**
     * Session callback — shapes the object that `useSession()` / `getSession()`
     * returns to the client.  Never expose the refresh_token to the browser.
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
