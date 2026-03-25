import { drupalFetch } from "./client";

/**
 * OAuth 2.0 Password Grant — Drupal Simple OAuth module
 *
 * Flow overview:
 *  1. The client sends the user's plaintext credentials to `/oauth/token`
 *     along with the application's client_id and client_secret.
 *  2. Drupal's Simple OAuth module validates the credentials and issues a
 *     short-lived access_token plus a long-lived refresh_token.
 *  3. The access_token is attached to every subsequent API request as a
 *     Bearer header.  When it expires, `refreshAccessToken` exchanges the
 *     refresh_token for a new token pair without requiring the user to
 *     log in again.
 *
 * Environment variables required:
 *   DRUPAL_CLIENT_ID     – OAuth2 consumer client ID configured in Drupal.
 *   DRUPAL_CLIENT_SECRET – OAuth2 consumer secret configured in Drupal.
 */

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  /** Lifetime of the access token in seconds */
  expires_in: number;
  token_type: string;
}

/**
 * Exchange a user's email + password for an OAuth 2.0 token pair.
 *
 * Uses the Resource Owner Password Credentials grant (grant_type=password).
 * This grant is appropriate for first-party clients where the user trusts the
 * application with their credentials; avoid it for third-party integrations.
 */
export async function fetchAccessToken(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const clientId = process.env.DRUPAL_CLIENT_ID;
  const clientSecret = process.env.DRUPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "DRUPAL_CLIENT_ID and DRUPAL_CLIENT_SECRET must be set in the environment.",
    );
  }

  // The token endpoint expects application/x-www-form-urlencoded, not JSON.
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: clientId,
    client_secret: clientSecret,
    username: email,
    password,
  });

  return drupalFetch<TokenResponse>("/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

/**
 * Exchange a refresh_token for a new access_token + refresh_token pair.
 *
 * Call this when the access_token has expired (checked via `expires_at` in the
 * JWT session).  The old refresh_token is invalidated by Drupal upon use, so
 * always persist the newly issued refresh_token.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
  const clientId = process.env.DRUPAL_CLIENT_ID;
  const clientSecret = process.env.DRUPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "DRUPAL_CLIENT_ID and DRUPAL_CLIENT_SECRET must be set in the environment.",
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  return drupalFetch<TokenResponse>("/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}
