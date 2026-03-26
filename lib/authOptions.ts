import type { NextAuthOptions } from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";
import { refreshAccessToken } from "@/lib/drupal/auth";

interface DrupalProfile {
  sub: string;
  name?: string;
  email?: string;
}

/** Convert expires_in (seconds from now) to an absolute Unix timestamp. */
function toExpiresAt(expiresIn: number): number {
  return Math.floor(Date.now() / 1000) + expiresIn;
}

/**
 * Custom OAuth 2.0 + PKCE provider for Drupal Simple OAuth.
 *
 * Uses a fully custom token.request to bypass openid-client's token exchange,
 * giving us direct control over the POST body sent to Drupal's /oauth/token.
 * This avoids the client_secret_basic / invalid_request issues that arise when
 * openid-client builds the token request for a public PKCE client.
 */
function DrupalProvider(): OAuthConfig<DrupalProfile> {
  const baseUrl = process.env.DRUPAL_BASE_URL!.replace(/\/$/, "");
  const tokenUrl = `${baseUrl}/oauth/token`;

  return {
    id: "drupal",
    name: "Drupal",
    type: "oauth",
    authorization: {
      url: `${baseUrl}/oauth/authorize`,
      params: { scope: "pokedex" },
    },
    token: {
      url: tokenUrl,
      async request({
        checks,
        params,
        provider,
      }: {
        checks: { code_verifier?: string };
        params: { code?: string };
        provider: { callbackUrl: string; clientId?: string };
      }) {
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code: params.code!,
          redirect_uri: provider.callbackUrl,
          client_id: provider.clientId!
        });

        if (checks.code_verifier) {
          body.set("code_verifier", checks.code_verifier);
        }

        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });

        const tokens = await response.json();

        return { tokens };
      },
    },
    userinfo: `${baseUrl}/oauth/userinfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.sub,
        email: profile.email,
      };
    },
    checks: ["pkce", "state"],
    clientId: process.env.DRUPAL_CLIENT_ID,
    client: {
      token_endpoint_auth_method: "none",
    },
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [DrupalProvider()],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      // Initial sign-in: persist tokens from the OAuth authorization response.
      if (account) {
        return {
          ...token,
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          // NextAuth sets expires_at as a Unix timestamp in seconds.
          expiresAt: account.expires_at!,
        };
      }

      // Access token is still valid.
      if (Date.now() / 1000 < token.expiresAt - 30) {
        return token;
      }

      // Access token expired — exchange refresh token for a new pair.
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
