import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchAccessToken, refreshAccessToken } from "@/lib/drupal/auth";

/** Convert expires_in (seconds from now) to an absolute Unix timestamp. */
function toExpiresAt(expiresIn: number): number {
  return Math.floor(Date.now() / 1000) + expiresIn;
}

export const authOptions: NextAuthOptions = {
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

          return {
            id: credentials.email,
            email: credentials.email,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: toExpiresAt(token.expires_in),
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
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

      if (Date.now() / 1000 < token.expiresAt - 30) {
        return token;
      }

      try {
        const refreshed = await refreshAccessToken(token.refreshToken);
        return {
          ...token,
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token,
          expiresAt: toExpiresAt(refreshed.expires_in),
        };
      } catch {
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
