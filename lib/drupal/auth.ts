import { drupalFetch } from "./client";

/**
 * OAuth 2.0 token refresh — Drupal Simple OAuth module
 *
 * The authorization code + PKCE flow is handled by NextAuth. This module only
 * provides the refresh-token exchange used when the access token expires.
 *
 * Environment variables required:
 *   DRUPAL_CLIENT_ID – OAuth2 consumer client ID configured in Drupal.
 */

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  /** Lifetime of the access token in seconds */
  expires_in: number;
  token_type: string;
}

/**
 * Exchange a refresh_token for a new access_token + refresh_token pair.
 *
 * Called by the NextAuth JWT callback when the access token has expired.
 * Drupal invalidates the old refresh token on use, so always persist the
 * newly issued one.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
  const clientId = process.env.DRUPAL_CLIENT_ID;

  if (!clientId) {
    throw new Error("DRUPAL_CLIENT_ID must be set in the environment.");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });

  return drupalFetch<TokenResponse>("/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}
